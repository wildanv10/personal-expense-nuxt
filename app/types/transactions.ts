import type { Transactions } from "./database.types";

type TransactionRow = Transactions["Row"];
export type TransactionWithRelations = Omit<
  TransactionRow,
  "category_id" | "payment_method_id" | "sub_category_id" | "user_id"
> & {
  categories: { id: number; name: string; icon: string } | null;
  sub_categories: { id: number; name: string; icon: string } | null;
  payment_methods: { id: number; name: string; icon: string } | null;
};
