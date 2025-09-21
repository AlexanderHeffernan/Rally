<template>
    <div class="navbar">
        <h1 @click="handleHomeClick" class="gradient-text-effect" style="cursor: pointer;">Rally</h1>
        <div class="navbar-right">
            <!-- Loading user state -->
            <template v-if="loading">
                Loading...
            </template>
            <!-- User loaded state-->
            <template v-else-if="user">
                <div class="user-dropdown" @click="toggleDropdown">
                    <span class="username">{{ user.username }}</span>
                    <font-awesome-icon icon="chevron-down" class="dropdown-arrow" />
                    <div v-if="dropdownOpen" class="dropdown-menu">
                        <button class="secondary-button primary" @click="goToAccount">
                            <font-awesome-icon icon="user" style="margin-right: 6px;" />
                            Account
                        </button>
                        <button class="secondary-button negative" @click="logout">
                            <font-awesome-icon icon="right-from-bracket" style="margin-right: 6px;" />
                            Log Out
                        </button>
                    </div>
                </div>
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
import { ref } from 'vue';
import { user, loading, useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
const { logout } = useAuth();

const router = useRouter();
const handleHomeClick = () => { router.push('/'); };
const goToAccount = () => { router.push('/account'); };

const dropdownOpen = ref(false);
const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};
</script>

<style scoped>
.navbar {
    background-color: var(--card-background);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}
.user-dropdown {
    position: relative;
    cursor: pointer;
    user-select: none;
}
.username {
    margin-right: 6px;
}
.dropdown-arrow {
    font-size: 0.8em;
}
.dropdown-menu {
    position: absolute;
    right: 0;
    top: 120%;
    background: var(--card-background, #f3f6fa);
    /* border: 1px solid #e0e0e0; */
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    min-width: 150px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
}
.dropdown-menu > button {
    width: 100%;
    text-align: left;
}
</style>