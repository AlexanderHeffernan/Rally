import { ref } from 'vue';

const API = process.env.VUE_APP_API_URL + '/auth';

// Globally accessible user state
export const user = ref<{ username: string } | null>(null);
export const availability = ref<{ [day: string]: number[] }>({});
export const loading = ref(true);

/**
 * Fetch the current user from the backend.
 * Call this on app startup to initialize user state.
 */
export async function fetchUser() {
    loading.value = true;
    try {
        const res = await fetch(`${API}/me`, {
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            user.value = { username: data.username };
        } else {
            user.value = null;
        }
    } catch {
        user.value = null;
    }
    loading.value = false;
}

/**
 * Composable for authentication actions.
 */
export function useAuth() {
    /**
     * Log in a user with username and password.
     */
    const login = async (username: string, password: string) => {
        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
        user.value = { username };
    };

    /**
     * Register a new user with username and password.
     */
    const register = async (username: string, password: string) => {
        const res = await fetch(`${API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Register failed');
        user.value = { username };
    };

    /**
     * Log out the current user.
     */
    const logout = async () => {
        await fetch(`${API}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        user.value = null;
    };

    return { user, login, register, logout, fetchUser };
}

export async function fetchAvailability() {
    const res = await fetch(`${API}/availability`, { credentials: 'include' });
    if (res.ok) {
        const data = await res.json();
        availability.value = data.availability || {};
    }
}

export async function updateAvailability(newAvailability: any) {
    const res = await fetch(`${API}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ availability: newAvailability })
    });
    if (res.ok) {
        availability.value = { ...newAvailability };
    }
}