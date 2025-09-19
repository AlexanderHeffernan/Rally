<template>
    <div class="sidebar">
        <!-- My Groups Heading -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3>My Groups</h3>
            <button class="secondary-button primary" @click="showNewGroup = true">
                <font-awesome-icon icon="plus" style="margin-right: 6px;" />
                New Group
            </button>
        </div>

        <!-- List of Groups -->
        <div class="groups-container">
            <router-link v-for="group in groups" :key="group.id" :to="`/groups/${group.id}`" style="text-decoration: none; color: inherit;">
                <div class="card">
                    <h4>{{ group.name }}<span v-if="group.admin.username === user?.username" style="margin-left: 10px; background: var(--primary-color-light); color: var(--primary-color); padding: 3px 10px; border-radius: .8rem; font-weight: 400; font-size: .9rem">Admin</span></h4>
                    <p style="color: var(--note-color)">{{ group.users.length }} members - {{ group.sport }}</p>
                </div>
            </router-link>
        </div>

        <!-- New Group Form -->
        <div v-if="showNewGroup">
            <h3>Create Group</h3>
            <form @submit.prevent="submit">
                <input v-model="name" placeholder="Group Name" required />
                <input v-model="sport" placeholder="Sport" required />
                <button type="submit">Create</button>
                <button type="button" @click="showNewGroup = false">Cancel</button>
            </form>
            <div v-if="error" style="color:red">{{ error }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { groups, fetchMyGroups, createGroup } from '@/composables/useGroups';
import { user } from '@/composables/useAuth';

const showNewGroup = ref(false);
const name = ref('');
const sport = ref('');
const error = ref('');

onMounted(fetchMyGroups);

async function submit() {
    error.value = '';
    try {
        await createGroup(name.value, sport.value);
        showNewGroup.value = false;
        name.value = '';
        sport.value = '';
    } catch (e: any) {
        error.value = e.message || 'Failed to create group';
    }
}
</script>