export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const userId = computed(() => user.value?.id);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = useState("isLoading", () => false);

  const signInWithGoogle = async () => {
    isLoading.value = true;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/confirm",
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err.message);
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    isLoading.value = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      else navigateTo("/login");
    } catch (err: any) {
      console.error(err.message);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    supabase,
    user,
    userId,
    isAuthenticated,
    isLoading,
    signInWithGoogle,
    signOut,
  };
};
