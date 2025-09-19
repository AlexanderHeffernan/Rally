import { ref } from 'vue';

const API = process.env.VUE_APP_API_URL + '/groups';

/**
 * Group interface representing a user group.
 */
export interface Group {
    id: string;
    name: string;
    sport: string;
    admin: { id: string; username: string };
    users: { id: string; username: string }[];
}

// Globally accessible groups state
export const groups = ref<Group[]>([]);

/**
 * Fetch groups the current user belongs to.
 */
export async function fetchMyGroups() {
    try {
        const res = await fetch(`${API}/my`, { credentials: 'include' });
        if (res.ok) { groups.value = await res.json(); }
        else { groups.value = []; }
    } catch (e) {
        groups.value = [];
    }
}

/**
 * Fetch a specific group by id.
 */
export async function fetchGroup(id: string): Promise<Group | null> {
    try {
        const res = await fetch(`${API}/${id}`, { credentials: 'include' });
        if (res.ok) {
            const group = await res.json();
            return group as Group;
        }
        return null;
    } catch (e) {
        return null;
    }
}

/**
 * Create a new group with the given name and sport.
 */
export async function createGroup(name: string, sport: string): Promise<Group | null> {
    try {
        const res = await fetch(`${API}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, sport })
        });
        if (!res.ok) throw new Error('Failed to create group');
        const group = await res.json();
        await fetchMyGroups();
        return group as Group;
    } catch (e) {
        return null;
    }
}

export async function joinGroup(id: string): Promise<{ ok: boolean; message?: string }> {
    try {
        const res = await fetch(`${API}/${id}/join`, {
            method: 'POST',
            credentials: 'include'
        });
        if (res.ok) return { ok: true };
        const data = await res.json().catch(() => ({}));
        return { ok: false, message: data.message || 'Failed to join group' };
    } catch (e) {
        return { ok: false, message: 'Network error' };
    }
}