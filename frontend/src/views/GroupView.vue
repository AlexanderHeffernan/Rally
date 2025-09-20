<template>
    <div v-if="group">
        <!-- Group Details -->
        <h2>{{ group.name }}</h2>
        <p>Sport: {{ group.sport }}</p>
        <p>Admin: {{ group.admin.username }}</p>
        
        <!-- Group Members List -->
        <h3>Members</h3>
        <ul>
            <li v-for="member in group.users" :key="member.id">{{ member.username }}</li>
        </ul>

        <!-- Invite Link -->
        <div>
            <h4>Invite Link</h4>
            <input :value="inviteLink" readonly style="width: 300px;" />
            <button @click="copyLink">Copy</button>
            <span v-if="copied" style="color: green;">Copied!</span>
        </div>

        <!-- Join Button -->
        <div v-if="showJoin">
            <button @click="handleJoinGroup">Join Group</button>
            <span v-if="joinError" style="color:red">{{ joinError }}</span>
        </div>

        <div v-if="user && group.admin.username === user.username">
            <button @click="suggestSessions">Suggest Session Times</button>
            <div v-if="showSessionSuggest">
                <h4>Best Times (most available members):</h4>
                <ul>
                    <li v-for="s in sessionSuggestions.slice(0, 5)" :key="s.day + s.hour">
                        {{ s.day }} {{ hourLabel(s.hour) }} ({{ s.count }} available)
                    </li>
                </ul>
            </div>
            <div>
                <h4>Create Session</h4>
                <input type="date" v-model="newSessionDate" />
                <input type="number" v-model="newSessionStart" min="0" max="23" />
                <input type="number" v-model="newSessionEnd" min="1" max="24" />
                <button @click="handleCreateSession">Create</button>
            </div>
        </div>
        <div>
            <h3>Sessions</h3>
            <ul>
                <li v-for="s in sessions" :key="s.id">
                    {{ s.date.slice(0,10) }} {{ hourLabel(s.startHour) }}-{{ hourLabel(s.endHour) }}
                    <span v-if="s.going.some(u => u.username === user?.username)">✅</span>
                    <span v-else-if="s.notGoing.some(u => u.username === user?.username)">❌</span>
                    <button @click="handleRespond(s.id, true)">Yes</button>
                    <button @click="handleRespond(s.id, false)">No</button>
                </li>
            </ul>
        </div>
    </div>
    <!-- Loading State-->
    <div v-else>
        Loading...
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { user } from '../composables/useAuth';
import { fetchGroup, joinGroup, fetchGroupAvailabilities } from '../composables/useGroups';
import { fetchGroupSessions, createSession, respondToSession, sessions } from '../composables/useSessions';

const route = useRoute();
const group = ref<any>(null);
const copied = ref(false);
const showJoin = ref(false);
const joinError = ref('');

const availabilities = ref<{ [username: string]: { [day: string]: number[] } }>({});
const showSessionSuggest = ref(false);
const sessionSuggestions = ref<{ day: string, hour: number, count: number }[]>([]);

const newSessionDate = ref('');
const newSessionStart = ref(7);
const newSessionEnd = ref(9);

/** Computed invite link based on current URL and group ID. */
const inviteLink = computed(() =>
    `${window.location.origin}/groups/${route.params.id}?invite=1`
);

/** Copy the invite link to clipboard. */
function copyLink() {
    navigator.clipboard.writeText(inviteLink.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
}

/**
 * Fetch group details and determine if the join button should be shown.
 */
async function handleFetchGroup() {
    const id = route.params.id as string;
    group.value = await fetchGroup(id);

    const isMember = user.value && group.value.users.some((u: any) => u.username === user.value?.username);
    const hasInvite = route.query.invite === '1';

    showJoin.value = !!user.value && !isMember && hasInvite;

    // Fetch availabilities if admin
    if (user.value && group.value.admin.username === user.value.username) {
        availabilities.value = await fetchGroupAvailabilities(group.value.id);
        suggestSessions();
    }
}

/**
 * Handle joining the group.
 */
async function handleJoinGroup() {
    joinError.value = '';
    const id = route.params.id as string;
    const res = await joinGroup(id);

    if (res.ok) {
        group.value = await fetchGroup(id);
        showJoin.value = false;
    } else {
        joinError.value = (await res).message || 'Failed to join group';
    }
}

/**
 * Compute session suggestions based on group availabilities.
 */
function suggestSessions() {
    // Build a map: { day: { hour: count } }
    const counts: Record<string, Record<number, number>> = {};
    for (const username in availabilities.value) {
        const userAvail = availabilities.value[username];
        for (const day in userAvail) {
            if (!counts[day]) counts[day] = {};
            for (const hour of userAvail[day]) {
                counts[day][hour] = (counts[day][hour] || 0) + 1;
            }
        }
    }
    // Flatten to array and sort by count descending
    const suggestions: { day: string, hour: number, count: number }[] = [];
    for (const day in counts) {
        for (const hour in counts[day]) {
            suggestions.push({ day, hour: Number(hour), count: counts[day][hour] });
        }
    }
    suggestions.sort((a, b) => b.count - a.count);
    sessionSuggestions.value = suggestions;
    showSessionSuggest.value = true;
}

function hourLabel(hour: number) {
    const ampm = hour < 12 ? 'AM' : 'PM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display} ${ampm}`;
}

async function handleCreateSession() {
    if (!group.value) return;
    await createSession(group.value.id, newSessionDate.value, newSessionStart.value, newSessionEnd.value);
    await fetchGroupSessions(group.value.id);
}
async function handleRespond(sessionId: string, going: boolean) {
    await respondToSession(sessionId, going);
    await fetchGroupSessions(group.value.id);
}

/** Fetch group on load. */
onMounted(() => {
    handleFetchGroup();
    if (group.value) {
        fetchGroupSessions(group.value.id);
    }
});
</script>