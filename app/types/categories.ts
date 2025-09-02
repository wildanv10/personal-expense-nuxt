import type { Categories } from "./database.types";

export type CategoryData = Omit<Categories["Row"], "created_at" | "user_id">;
