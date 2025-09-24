// middleware/validateTransaction.js

export default defineNuxtRouteMiddleware(async (to) => {
  const transactionId = to.params.id ? to.params.id : null;

  if (!transactionId) {
    return navigateTo("/404");
  }

  // 1. Check if transaction ID is a valid number
  if (isNaN(Number(transactionId))) {
    return navigateTo("/404"); // or redirect to a custom error page
  }

  // TODO:
  // 2. Check if the transaction ID belongs to the user
  // const userId = $auth.user.id  // Assuming you are using some auth module
  // Replace this with actual API call to check ownership
  // const transaction = await context.$axios.$get(`/api/transactions/${transactionId}`)
  // if (!transaction || transaction.user_id !== userId) {
  //   return redirect('/403') // or redirect to a permission error page
  // }
});
