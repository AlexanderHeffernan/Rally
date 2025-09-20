import { ref } from 'vue';
const API = process.env.VUE_APP_API_URL + '/sessions';

export const sessions = ref<any[]>([]);

export async function fetchGroupSessions(groupId: string) {
    const res = await fetch(`${API}/group/${groupId}`, { credentials: 'include' });
    if (res.ok) sessions.value = await res.json();
}

export async function fetchMySessions() {
    const res = await fetch(`${API}/my`, { credentials: 'include' });
    if (res.ok) sessions.value = await res.json();
}

export async function createSession(groupId: string, date: string, startHour: number, endHour: number) {
    const res = await fetch(`${API}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ groupId, date, startHour, endHour })
    });
    return res.ok ? await res.json() : null;
}

export async function respondToSession(sessionId: string, going: boolean) {
    const res = await fetch(`${API}/${sessionId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ going })
    });
    return res.ok ? await res.json() : null;
}