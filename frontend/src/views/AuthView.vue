<template>
  <div>
    <h2>{{ mode === 'login' ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Username:</label>
        <input v-model="username" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">{{ mode === 'login' ? 'Login' : 'Register' }}</button>
    </form>
    <button @click="toggleMode">
      {{ mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login' }}
    </button>
    <div v-if="error" style="color:red">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const mode = ref<'login' | 'register'>('login');
const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const { login, register } = useAuth();

const handleSubmit = async () => {
    error.value = '';
    try {
    if (mode.value === 'login') {
        await login(username.value, password.value);
    } else {
        await register(username.value, password.value);
    }
    router.push('/');
    } catch (e: any) {
    error.value = e.message || 'Error';
    }
};

const toggleMode = () => {
    mode.value = mode.value === 'login' ? 'register' : 'login';
    error.value = '';
};
</script>