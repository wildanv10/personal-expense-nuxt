import type { TransactionWithRelations } from "~/types/transactions";

/**
 * Format a number with a thousand separator.
 * @param {number | string} number - The number to format.
 * @param {string} [locale='en-US'] - The locale to use for formatting (default is 'en-US').
 * @returns {string} The formatted number with thousand separators.
 */
export function formatWithThousandSeparator(
  number: number | string,
  locale: string = "id-ID"
): string {
  // Ensure the number is parsed as a float
  const parsedNumber = parseFloat(number as string);

  // Check if the input is a valid number
  if (isNaN(parsedNumber)) {
    throw new Error("Invalid number");
  }

  // Format the number using the provided locale
  return new Intl.NumberFormat(locale).format(parsedNumber);
}

/**
 * Utility function to group transactions by date.
 * @param transactions - Array of transaction objects.
 * @returns - Grouped transactions by date.
 */
export function groupTransactionsByDate(
  transactions: TransactionWithRelations[]
): Record<string, TransactionWithRelations[]> {
  // Sort date descending

  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce((groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, TransactionWithRelations[]>);
}

/**
 * Calculates the total income, total expense, and balance from a list of transactions.
 *
 * @param transactions - Array of transaction objects
 * @returns An object containing:
 *   - income: total income amount
 *   - expense: total expense amount
 *   - balance: income minus expense
 */
export function calculateTransactionSummary(
  transactions: TransactionWithRelations[]
): {
  income: number;
  expense: number;
  balance: number;
} {
  let income = 0;
  let expense = 0;

  for (const tx of transactions) {
    if (tx.type === "income") {
      income += tx.amount;
    } else if (tx.type === "expense") {
      expense += tx.amount;
    }
  }

  const balance = income - expense;

  return {
    income,
    expense,
    balance,
  };
}
