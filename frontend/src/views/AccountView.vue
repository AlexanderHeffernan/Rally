<template>
    <div class="account-view">
        <!-- Account Details -->
        <h2>Account</h2>
        <div v-if="user">
            <p><b>Username:</b> {{ user.username }}</p>
        </div>

        <!-- Weekly Availability Settings-->
        <h3>Weekly Availability</h3>
        <div class="availability-scroll-controls">
            <button
                class="arrow-btn"
                @click="scrollUp"
                :disabled="visibleStartHour === 0"
                aria-label="Show earlier hours"
            >▲</button>
        </div>
        <div
            class="availability-grid"
            @mousedown.prevent="startDrag"
            @touchstart.prevent="startDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            @touchend="stopDrag"
        >
            <div class="header-row">
                <div class="cell header"></div>
                <div v-for="day in days" :key="day" class="cell header day-label">{{ dayLabels[day] }}</div>
            </div>
            <div v-for="hour in visibleHours" :key="hour" class="row">
                <div class="cell header time-label">{{ hourLabel(hour) }}</div>
                <div
                    v-for="day in days"
                    :key="day"
                    class="cell"
                    :class="{ selected: isSelected(day, hour) }"
                    @mousedown.prevent="cellDown(day, hour)"
                    @mouseenter="cellEnter(day, hour)"
                    @touchstart.prevent="cellDown(day, hour, $event)"
                    @touchmove.prevent="cellTouchMove($event)"
                    :data-day="day"
                    :data-hour="hour"
                ></div>
            </div>
        </div>
        <div class="availability-scroll-controls">
            <button
                class="arrow-btn"
                @click="scrollDown"
                :disabled="visibleEndHour === 24"
                aria-label="Show later hours"
            >▼</button>
        </div>
        <button @click="save" class="save-btn">Save</button>
        <span v-if="saved" style="color:green">Saved!</span>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { user, availability, fetchAvailability, updateAvailability } from '../composables/useAuth';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayLabels: Record<string, string> = {
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    Sun: 'Sun',
};

const hours = Array.from({ length: 24 }, (_, i) => i);

// Window state for visible hours
const DEFAULT_START = 7;
const DEFAULT_END = 19;
const MIN_HOUR = 0;
const MAX_HOUR = 24;
const WINDOW_SIZE = DEFAULT_END - DEFAULT_START;

const visibleStartHour = ref(DEFAULT_START);
const visibleEndHour = ref(DEFAULT_END);

const visibleHours = computed(() =>
    Array.from({ length: visibleEndHour.value - visibleStartHour.value }, (_, i) => i + visibleStartHour.value)
);

function scrollUp() {
    if (visibleStartHour.value > MIN_HOUR) {
        visibleStartHour.value--;
        visibleEndHour.value--;
    }
}
function scrollDown() {
    if (visibleEndHour.value < MAX_HOUR) {
        visibleStartHour.value++;
        visibleEndHour.value++;
    }
}

function hourLabel(hour: number) {
    const ampm = hour < 12 ? 'AM' : 'PM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display} ${ampm}`;
}

const grid = ref<{ [day: string]: Set<number> }>({});
const dragging = ref(false);
const dragMode = ref<'add' | 'remove' | null>(null);
const saved = ref(false);

function isSelected(day: string, hour: number) {
    return grid.value[day]?.has(hour);
}

function cellDown(day: string, hour: number, e?: TouchEvent) {
    if (!grid.value[day]) grid.value[day] = new Set();
    dragMode.value = grid.value[day].has(hour) ? 'remove' : 'add';
    updateCell(day, hour);
    dragging.value = true;
}

function cellEnter(day: string, hour: number) {
    if (!dragging.value || !dragMode.value) return;
    updateCell(day, hour);
}

function cellTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const cell = (el as HTMLElement).closest('.cell:not(.header)');
    if (cell && cell.dataset.day && cell.dataset.hour) {
        cellEnter(cell.dataset.day, parseInt(cell.dataset.hour));
    }
}

function updateCell(day: string, hour: number) {
    if (!grid.value[day]) grid.value[day] = new Set();
    if (dragMode.value === 'add') grid.value[day].add(hour);
    else if (dragMode.value === 'remove') grid.value[day].delete(hour);
}

function startDrag() {
    dragging.value = true;
}

function stopDrag() {
    dragging.value = false;
    dragMode.value = null;
}

async function save() {
    const toSave: { [day: string]: number[] } = {};
    for (const day of days) {
        toSave[day] = Array.from(grid.value[day] || []).sort((a, b) => a - b);
    }
    await updateAvailability(toSave);
    saved.value = true;
    setTimeout(() => (saved.value = false), 1200);
}

function loadGridFromAvailability() {
    const newGrid: { [day: string]: Set<number> } = {};
    for (const day of days) {
        newGrid[day] = new Set(availability.value[day] || []);
    }
    grid.value = newGrid;
}

onMounted(async () => {
    await fetchAvailability();
    loadGridFromAvailability();
});

watch(availability, loadGridFromAvailability);
</script>

<style scoped>
.account-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.availability-scroll-controls {
    display: flex;
    justify-content: center;
    margin: 4px 0;
}

.arrow-btn {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 1.3rem;
    cursor: pointer;
    transition: background 0.2s, border 0.2s;
    margin: 0 0 4px 0;
    color: #155dfb;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.arrow-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.availability-grid {
    width: 100%;
    min-width: 420px;
    margin-bottom: 20px;
    user-select: none;
    -webkit-user-select: none;
    border-radius: 8px;
    background: #f8fafd;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    overflow-x: auto;
}

.header-row, .row {
    display: flex;
    width: 100%;
}

.cell, .cell.header {
    flex: 1 1 0;
    min-width: 60px;
    height: 60px;
    border: 1px solid var(--note-color, #e0e0e0);
    box-sizing: border-box;
    transition: background 0.2s, border 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
    font-size: 1.1rem;
    cursor: pointer;
    position: relative;
}

.cell {
    background: var(--card-background, #fff);
}

.cell.header {
    background: var(--card-background-dark, #f3f6fa);
    font-weight: bold;
    border: none;
    cursor: default;
}

.cell.day-label, .cell.time-label {
    font-size: 1.15rem;
    color: #888;
}

.cell.selected {
    background: var(--primary-color-light, #e0eaff);
    border: 2px solid var(--primary-color, #155dfb);
}

.save-btn {
    margin-top: 10px;
    padding: 10px 24px;
    font-size: 1.1rem;
    border-radius: 8px;
    background: var(--primary-color, #155dfb);
    color: #fff;
    border: none;
    cursor: pointer;
}

@media (max-width: 900px) {
    .cell, .cell.header {
        min-width: 40px;
        height: 40px;
        font-size: 0.95rem;
    }
    .account-view {
        padding: 8px;
    }
}

@media (max-width: 600px) {
    .cell, .cell.header {
        min-width: 28px;
        height: 28px;
        font-size: 0.85rem;
    }
    .account-view {
        padding: 4px;
    }
}
</style>