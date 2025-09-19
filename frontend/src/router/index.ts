import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';
import GroupView from '../views/GroupView.vue';
import { user, fetchUser } from '../composables/useAuth';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/auth', name: 'Auth', component: AuthView },
  { path: '/groups/:id', name: 'Group', component: GroupView }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Global auth guard
router.beforeEach(async (to, from, next) => {
  // Allow access to /auth
  if (to.path === '/auth') return next();

  // If user is not loaded, fetch it
  if (user.value === null) {
    await fetchUser();
  }

  // If not authenticated, redirect to /auth with redirect param
  if (!user.value) {
    return next({
      path: '/auth',
      query: { redirect: to.fullPath }
    });
  }

  // Otherwise, proceed
  next();
});

export default router;