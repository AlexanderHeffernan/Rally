<template>
    <div class="app">
        <NavBar/>
        <router-view/>
    </div>
</template>

<script lang="ts" setup>
import NavBar from './components/NavBar.vue'
</script>