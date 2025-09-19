import { ref } from 'vue';

const API = process.env.VUE_APP_API_URL + '/auth';

export const user = ref<{ username: string } | null>(null);
export const loading = ref(true);

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

export function useAuth() {
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

  const logout = async () => {
    await fetch(`${API}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    user.value = null;
  };

  return { user, login, register, logout, fetchUser };
}