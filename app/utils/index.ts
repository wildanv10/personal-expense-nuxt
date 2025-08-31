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

/**
 * Converts a date string (format "YYYY-MM-DD") into a more human-readable format.
 * Utilizes JavaScript's Intl.DateTimeFormat API.
 *
 * @param dateString - The input date in ISO format ("YYYY-MM-DD").
 * @param format - The desired output format:
 *    - 'dayMonth' => "28 August"
 *    - 'dayMonthYear' => "28 August 2025"
 *    - 'monthYear' => "August 2025"
 *    - 'iso' => "2025-08-28"
 *    - 'short' => "28/08/2025"
 * @param locale - (Optional) Locale for formatting (default: "en-US").
 * @returns A formatted date string according to the specified format.
 */
export function formatDate(
  dateString: string,
  format:
    | "dayMonth"
    | "dayMonthYear"
    | "monthYear"
    | "iso"
    | "short" = "dayMonth",
  locale: string = "en-ID"
): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
  }

  switch (format) {
    case "dayMonth":
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
      }).format(date);

    case "dayMonthYear":
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);

    case "monthYear":
      return new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(date);

    case "short":
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;

    case "iso":
    default:
      if (!date.toISOString().split("T")[0])
        console.error("Failed to format date.");

      return date.toISOString().split("T")[0] || dateString;
  }
}
