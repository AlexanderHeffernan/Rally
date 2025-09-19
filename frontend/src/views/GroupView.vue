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
import { fetchGroup, joinGroup } from '../composables/useGroups';

const route = useRoute();
const group = ref<any>(null);
const copied = ref(false);
const showJoin = ref(false);
const joinError = ref('');

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

/** Fetch group on load. */
onMounted(handleFetchGroup);
</script>