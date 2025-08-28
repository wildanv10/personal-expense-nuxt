export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const userId = computed(() => user.value?.id);
  const isAuthenticated = computed(() => !!user.value);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/confirm",
      },
    });
    if (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    else navigateTo("/login");
  };

  return {
    supabase,
    user,
    userId,
    isAuthenticated,
    signInWithGoogle,
    signOut,
  };
};
