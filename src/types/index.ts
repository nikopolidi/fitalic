import { UserData } from "./database/user";

import { DailyNutrition } from "./database";

export type UserContext = (Partial<UserData> & {
  foodIntakes?: DailyNutrition;
}) | undefined | null;
