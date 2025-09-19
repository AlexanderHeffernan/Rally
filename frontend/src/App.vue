<template>
  <NavBar />
  <router-view />
</template>

<script lang="ts" setup>
import NavBar from './components/NavBar.vue';
import { onMounted } from 'vue';
import { fetchUser, user } from './composables/useAuth';

onMounted(() => {
    fetchUser();
});
</script>