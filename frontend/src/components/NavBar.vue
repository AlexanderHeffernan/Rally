<template>
  <div class="navbar">
    <h1 class="gradient-text-effect">Rally</h1>
    <div style="float:right">
      <template v-if="loading">
        Loading...
      </template>
      <template v-else-if="user">
        <span>{{ user.username }}</span>
        <button @click="logout">Log Out</button>
      </template>
      <template v-else>
        <router-link to="/auth">
          <button>Sign In/Up</button>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { user, loading, useAuth, fetchUser } from '../composables/useAuth';

const { logout } = useAuth();
onMounted(() => {
    fetchUser();
});
</script>

<style scoped>
.navbar {
    background-color: white;
    padding: 20px;
}
</style>