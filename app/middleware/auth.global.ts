export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient();

  // Wait for session to restore
  const { data: sessionData, error } = await supabase.auth.getSession();

  // If no session and not on login page, redirect to login
  if (!sessionData.session && to.path !== "/login") {
    return navigateTo("/login");
  }

  // If already logged in and trying to access login page, redirect home
  if (sessionData.session && to.path === "/login") {
    return navigateTo("/");
  }
});
