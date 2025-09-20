<template>
    <div class="navbar">
        <h1 @click="handleHomeClick" class="gradient-text-effect" style="cursor: pointer;">Rally</h1>
        <div style="float:right">
            <!-- Loading user state -->
            <template v-if="loading">
                Loading...
            </template>
            <!-- User loaded state-->
            <template v-else-if="user">
                <span>{{ user.username }}</span>
                <button @click="logout">Log Out</button>
            </template>
            <!-- No user state -->
            <template v-else>
                <router-link to="/auth">
                    <button>Sign In/Up</button>
                </router-link>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { user, loading, useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
const { logout } = useAuth();

const router = useRouter();
const handleHomeClick = () => {
    router.push('/');
};
</script>

<style scoped>
.navbar {
    background-color: var(--card-background);
    padding: 20px;
}
</style>