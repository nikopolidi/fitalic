import { map } from "lodash";

const logMealFunction = {
  "name": "log_meal",
  // handler: async (args) => {
  //   // automatically calls API
  //   await fetch('https://fita/meals', { /*…*/ });
  //   return { status: 'ok' };
  // },
  "description": "Log a meal with calorie and macro details",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": [
          "breakfast",
          "morningSnack",
          "lunch",
          "afternoonSnack",
          "dinner",
          "eveningSnack",
          "custom"
        ],
        "description": "Type of the meal"
      },
      "name": {
        "type": "string",
        "description": "Optional custom name for the meal"
      },
      "foods": {
        "type": "array",
        "description": "List of consumed foods in the meal",
        "items": {
          "type": "object",
          "properties": {
            "foodItem": {
              "type": "object",
              "description": "Core info about the food item",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Unique identifier of the food item"
                },
                "name": {
                  "type": "string",
                  "description": "Name of the food item"
                },
                "calories": {
                  "type": "number",
                  "description": "Calories per serving or per 100 g"
                },
                "servingSize": {
                  "type": "number",
                  "description": "Serving size amount"
                },
                "servingUnit": {
                  "type": "string",
                  "enum": ["g","ml","oz","tbsp","tsp","cup","piece","custom"],
                  "description": "Unit of the serving size"
                },
                "isPerServing": {
                  "type": "boolean",
                  "description": "True if nutrition info is per serving, false if per 100 g"
                },
                "macros": {
                  "type": "object",
                  "description": "Macronutrients per serving or per 100 g",
                  "properties": {
                    "protein": { "type": "number", "description": "Protein in grams" },
                    "carbs":   { "type": "number", "description": "Carbs in grams" },
                    "fat":     { "type": "number", "description": "Fat in grams" },
                    "fiber":   { "type": "number", "description": "Fiber in grams" },
                    "sugar":   { "type": "number", "description": "Sugar in grams" }
                  },
                  "required": ["protein","carbs","fat"]
                },
                "imageUri": {
                  "type": "string",
                  "description": "Optional URI to an image of the food item"
                }
              },
              "required": ["id","name","calories","servingSize","servingUnit","isPerServing","macros"]
            },
            "amount": {
              "type": "number",
              "description": "Quantity consumed (in servings or grams)"
            },
            "totalCalories": {
              "type": "number",
              "description": "Total calories for the consumed amount"
            },
            "totalMacros": {
              "type": "object",
              "description": "Total macronutrients for the consumed amount",
              "properties": {
                "protein": { "type": "number", "description": "Total protein in grams" },
                "carbs":   { "type": "number", "description": "Total carbs in grams" },
                "fat":     { "type": "number", "description": "Total fat in grams" },
                "fiber":   { "type": "number", "description": "Total fiber in grams" },
                "sugar":   { "type": "number", "description": "Total sugar in grams" }
              },
              "required": ["protein","carbs","fat"]
            }
          },
          "required": ["foodItem","amount","totalCalories","totalMacros"]
        }
      },
      "totalCalories": {
        "type": "number",
        "description": "Sum of calories for all foods in the meal"
      },
      "totalMacros": {
        "type": "object",
        "description": "Sum of macronutrients for all foods in the meal",
        "properties": {
          "protein": { "type": "number", "description": "Total protein in grams" },
          "carbs":   { "type": "number", "description": "Total carbs in grams" },
          "fat":     { "type": "number", "description": "Total fat in grams" },
          "fiber":   { "type": "number", "description": "Total fiber in grams" },
          "sugar":   { "type": "number", "description": "Total sugar in grams" }
        },
        "required": ["protein","carbs","fat"]
      },
      "date": {
        "type": "integer",
        "description": "Unix timestamp for the date (start of day)"
      },
      "time": {
        "type": "integer",
        "description": "Unix timestamp for the time of the meal"
      },
      "notes": {
        "type": "string",
        "description": "Optional notes about the meal"
      },
      "imageUri": {
        "type": "string",
        "description": "Optional URI to a photo of the meal"
      }
    },
    "required": ["type","foods","totalCalories","totalMacros","date","time"]
  }
} as const;

const logDailyNutritionFunction = {
  "name": "log_daily_nutrition",
  "description": "Log a daily nutrition summary with all meals and totals",
  "parameters": {
    "type": "object",
    "properties": {
      "date": {
        "type": "integer",
        "description": "Unix timestamp for the day (start of day)"
      },
      "meals": {
        "type": "array",
        "description": "Array of meals consumed during the day",
        "items": {
          "type": "object",
          "properties": {
            "type": { "type": "string", "description": "Meal type" },
            "totalCalories": { "type": "number", "description": "Calories for this meal" },
            "totalMacros": {
              "type": "object",
              "properties": {
                "protein": { "type": "number" },
                "carbs":   { "type": "number" },
                "fat":     { "type": "number" },
                "fiber":   { "type": "number" },
                "sugar":   { "type": "number" }
              },
              "required": ["protein","carbs","fat"]
            }
          }
          // Required properties can be inferred if needed
        }
      },
      "totalCalories": {
        "type": "number",
        "description": "Total calories for the day"
      },
      "totalMacros": {
        "type": "object",
        "description": "Total macronutrients for the day",
        "properties": {
          "protein": { "type": "number" },
          "carbs":   { "type": "number" },
          "fat":     { "type": "number" },
          "fiber":   { "type": "number" },
          "sugar":   { "type": "number" }
        },
        "required": ["protein","carbs","fat"]
      }
    },
    "required": ["date", "meals", "totalCalories", "totalMacros"]
  }
} as const;

const storeMemoryFunction = {
  "name": "store_memory",
  "description": "Store a persistent fact about the user for future conversations",
  "parameters": {
    "type": "object",
    "properties": {
      "confirmation": {
        "type": "string",
        "description": "A human-readable confirmation text to show to the user"
      }
    },
    "required": ["confirmation"]
  }
} as const;

const updateAnthropometryFunction = {
  "name": "update_anthropometry",
  "description": "Update user's anthropometric data",
  "parameters": {
    "type": "object",
    "properties": {
      "weight": {
        "type": "number",
        "description": "User's weight in kilograms"
      },
      "height": {
        "type": "number",
        "description": "User's height in centimeters"
      },
      "age": {
        "type": "integer",
        "description": "User's age in years"
      },
      "gender": {
        "type": "string",
        "enum": ["male", "female"],
        "description": "User's gender: male, female"
      },
      "activityLevel": {
        "type": "string",
        "enum": ["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "extraActive"],
        "description": "User's activity level (sedentary, lightlyActive, moderatelyActive, veryActive, extraActive)"
      },
      "bodyFatPercentage": {
        "type": "number",
        "description": "Optional user's body fat percentage (%)"
      },
      "waistCircumference": {
        "type": "number",
        "description": "Optional user's waist circumference in cm"
      },
      "hipCircumference": {
        "type": "number",
        "description": "Optional user's hip circumference in cm"
      },
      "chestCircumference": {
        "type": "number",
        "description": "Optional user's chest circumference in cm"
      }
    },
    "required": ["weight","height","age","gender","activityLevel"]
  }
} as const;

const updateGoalsFunction = {
  "name": "update_goals",
  "description": "Update user's daily nutrition targets (calories, protein, carbs, fat) and/or primary diet type.",
  "parameters": {
    "type": "object",
    "properties": {
      "calories": {
        "type": "number",
        "description": "Optional: New daily calorie target in kcal"
      },
      "protein": {
        "type": "number",
        "description": "Optional: New daily protein target in grams"
      },
      "carbs": {
        "type": "number",
        "description": "Optional: New daily carbs target in grams"
      },
      "fat": {
        "type": "number",
        "description": "Optional: New daily fat target in grams"
      },
      "dietType": {
        "type": "string",
        "enum": [
          "omnivore", 
          "vegetarian", 
          "vegan", 
          "pescatarian", 
          "keto", 
          "paleo", 
          "lowCarb", 
          "lowFat", 
          "glutenFree", 
          "dairyFree", 
          "custom"
        ],
        "description": "Optional: Update the primary dietary preference"
      }
    },
    "required": []
  }
} as const;

const noOpFunction = {
  "name": "no_op",
  "description": "No operation: respond with text only, without structured data",
  "parameters": {
    "type": "object",
    "properties": {},
    "required": []
  }
} as const;

export const FUNCTION_CALLS = {
  logMealFunction,
  logDailyNutritionFunction,
  updateGoalsFunction,
  storeMemoryFunction,
  noOpFunction,
  updateAnthropometryFunction
}

export const FUNCTION_NAMES = map(Object.values(FUNCTION_CALLS), 'name');