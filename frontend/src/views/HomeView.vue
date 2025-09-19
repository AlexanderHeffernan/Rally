<template>
    <div class="home">
        <h1>Welcome Back! 👋</h1>
        <p>You have x meets coming up and y meets waiting for your response.</p>
        <div class="main-container">
            <div class="main-panel">
                <h2>Upcoming Meets</h2>
                <h2>Action Required</h2>
            </div>
            <div class="side-panel">
                <h3>My Groups</h3>
                <h3>Quick Actions</h3>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.home {
    padding: 20px;
}

.main-container {
    display: flex;
    gap: 20px;
}

.main-panel {
    flex: 3;
    border-radius: 8px;
}

.side-panel {
    flex: 1;
    border-radius: 8px;
}

</style>