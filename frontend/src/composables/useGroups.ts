import { ref } from 'vue';

export interface Group {
  id: string;
  name: string;
  sport: string;
  admin: { id: string; username: string };
  users: { id: string; username: string }[];
}

export const groups = ref<Group[]>([]);

export async function fetchMyGroups() {
  const res = await fetch(process.env.VUE_APP_API_URL + '/groups/my', { credentials: 'include' });
  if (res.ok) {
    groups.value = await res.json();
  } else {
    groups.value = [];
  }
}

export async function createGroup(name: string, sport: string) {
  const res = await fetch(process.env.VUE_APP_API_URL + '/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, sport })
  });
  if (!res.ok) throw new Error('Failed to create group');
  await fetchMyGroups();
}