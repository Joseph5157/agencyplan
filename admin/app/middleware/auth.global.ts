export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return;

  const { token, loadToken } = useAuthToken();
  loadToken();

  const isLoginRoute = to.path === "/login";
  const hasToken = Boolean(token.value);

  if (!hasToken && !isLoginRoute) {
    return navigateTo("/login");
  }

  if (hasToken && isLoginRoute) {
    return navigateTo("/dashboard");
  }
});
