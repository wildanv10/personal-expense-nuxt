export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:transition:finish", () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  });
});
