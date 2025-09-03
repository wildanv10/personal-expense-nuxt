import type { SubCategories } from "./database.types";

export type SubCategoryData = Omit<
  SubCategories["Row"],
  "created_at" | "user_id"
>;
