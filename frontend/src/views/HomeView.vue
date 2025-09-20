<template>
    <div class="home">
        <h1>Welcome Back! 👋</h1>
        <p>You have {{ sessions.length }} meets coming up.</p>
        <div class="main-container">
            <div class="main-panel">
                <h2>Upcoming Meets</h2>
                <ul>
                    <li v-for="s in sessions" :key="s.id">
                        {{ s.group.name }}: {{ s.date.slice(0,10) }} {{ hourLabel(s.startHour) }}-{{ hourLabel(s.endHour) }}
                        <span v-if="s.going.some(u => u.username === user?.username)">✅</span>
                        <span v-else-if="s.notGoing.some(u => u.username === user?.username)">❌</span>
                        <button @click="respond(s.id, true)">Yes</button>
                        <button @click="respond(s.id, false)">No</button>
                    </li>
                </ul>
            </div>
            <div class="side-panel">
                <SideBar />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { fetchMySessions, sessions, respondToSession } from '../composables/useSessions';
import { user } from '../composables/useAuth';
import SideBar from '../components/SideBar.vue';

function hourLabel(hour: number) {
    const ampm = hour < 12 ? 'AM' : 'PM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display} ${ampm}`;
}

async function respond(sessionId: string, going: boolean) {
    await respondToSession(sessionId, going);
    await fetchMySessions();
}
</script>

<style scoped>
.home {
    padding: 20px;
}

.main-container {
    display: flex;
    gap: 20px;
}

.main-panel {
    flex: 3;
    border-radius: 8px;
}

.side-panel {
    flex: 1;
    border-radius: 8px;
}

</style>