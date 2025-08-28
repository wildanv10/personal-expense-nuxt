export const constants = {
  expense: "expense",
  income: "income",
  options: {
    transactionType: [
      { key: "expense", value: "Expense" },
      { key: "income", value: "Income" },
    ],
  },
  routes: {
    // home page
    home: "/home",
    home_transactions: "/home/transactions",
    home_budgets: "/home/budgets",

    // transaction page
    transaction: "/transaction",

    // statistics page
    statistics: "/statistics",

    // settings page
    settings: "/settings",
    settings_categories: "/settings/categories",
    settings_categories_add: "/settings/categories/add",
    settings_categories_update: "/settings/categories/update",
    settings_payment_methods: "/settings/payment-methods",
    settings_payment_methods_add: "/settings/payment-methods/add",
    settings_payment_methods_update: "/settings/payment-methods/update",
  },
};
