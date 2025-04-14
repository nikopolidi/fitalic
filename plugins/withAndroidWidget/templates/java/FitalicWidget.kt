package com.vitalii.nikopolidi.fitalic.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import android.util.Log
import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import android.os.Build
import com.vitalii.nikopolidi.fitalic.R
import org.json.JSONObject

/**
 * Implementation of App Widget functionality.
 */
class FitalicWidget : AppWidgetProvider() {
    
    companion object {
        private const val TAG = "FitalicWidget"
        private const val PREFS_NAME = "com.vitalii.nikopolidi.fitalic.shared"
        private const val TARGET_NUTRITION = "targetNutrition"
        private const val CONSUMED_NUTRITION = "consumedNutrition"
        
        /**
         * Update all active widgets with the latest data
         */
        fun updateAllWidgets(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(
                android.content.ComponentName(context, FitalicWidget::class.java)
            )
            
            // Update all widgets
            if (appWidgetIds.isNotEmpty()) {
                onUpdate(context, appWidgetManager, appWidgetIds)
            }
        }

        /**
         * Update widgets with data
         */
        fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
            // Load nutrition data from SharedPreferences
            val sharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            
            val targetNutritionStr = sharedPreferences.getString(TARGET_NUTRITION, null)
            val consumedNutritionStr = sharedPreferences.getString(CONSUMED_NUTRITION, null)
            
            // Parse nutrition data
            val targetNutrition = parseNutritionData(targetNutritionStr)
            val consumedNutrition = parseNutritionData(consumedNutritionStr)
            
            // Update all widgets
            for (appWidgetId in appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId, targetNutrition, consumedNutrition)
            }
        }
        
        /**
         * Parse nutrition data from JSON string
         */
        private fun parseNutritionData(jsonString: String?): Map<String, Int> {
            if (jsonString == null) {
                return mapOf(
                    "calories" to 0,
                    "protein" to 0,
                    "carbs" to 0,
                    "fat" to 0
                )
            }
            
            return try {
                val json = JSONObject(jsonString)
                mapOf(
                    "calories" to json.optInt("calories", 0),
                    "protein" to json.optInt("protein", 0),
                    "carbs" to json.optInt("carbs", 0),
                    "fat" to json.optInt("fat", 0)
                )
            } catch (e: Exception) {
                Log.e(TAG, "Error parsing nutrition data: ${e.message}")
                mapOf(
                    "calories" to 0,
                    "protein" to 0,
                    "carbs" to 0,
                    "fat" to 0
                )
            }
        }
        
        /**
         * Calculate progress percentage (0-100)
         */
        private fun calculateProgress(current: Int, target: Int): Int {
            if (target <= 0) return 0
            val progress = (current.toFloat() / target.toFloat() * 100).toInt()
            return minOf(progress, 100) // Cap at 100%
        }
    }

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        Companion.onUpdate(context, appWidgetManager, appWidgetIds)
    }

    override fun onEnabled(context: Context) {
        // Enter relevant functionality for when the first widget is created
    }

    override fun onDisabled(context: Context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

/**
 * Update a single app widget
 */
private fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int,
    targetNutrition: Map<String, Int>,
    consumedNutrition: Map<String, Int>
) {
    // Create RemoteViews object to manipulate widget
    val views = RemoteViews(context.packageName, R.layout.fitalic_widget)
    
    // Calculate progress values
    val caloriesProgress = FitalicWidget.Companion.calculateProgress(
        consumedNutrition["calories"] ?: 0,
        targetNutrition["calories"] ?: 0
    )
    val proteinProgress = FitalicWidget.Companion.calculateProgress(
        consumedNutrition["protein"] ?: 0,
        targetNutrition["protein"] ?: 0
    )
    val carbsProgress = FitalicWidget.Companion.calculateProgress(
        consumedNutrition["carbs"] ?: 0,
        targetNutrition["carbs"] ?: 0
    )
    val fatProgress = FitalicWidget.Companion.calculateProgress(
        consumedNutrition["fat"] ?: 0,
        targetNutrition["fat"] ?: 0
    )
    
    // Set progress bars
    views.setProgressBar(R.id.calories_progress, 100, caloriesProgress, false)
    views.setProgressBar(R.id.protein_progress, 100, proteinProgress, false)
    views.setProgressBar(R.id.carbs_progress, 100, carbsProgress, false)
    views.setProgressBar(R.id.fat_progress, 100, fatProgress, false)
    
    // Set text values
    views.setTextViewText(R.id.calories_value, "${consumedNutrition["calories"]} / ${targetNutrition["calories"]}")
    views.setTextViewText(R.id.protein_value, "${consumedNutrition["protein"]} / ${targetNutrition["protein"]}")
    views.setTextViewText(R.id.carbs_value, "${consumedNutrition["carbs"]} / ${targetNutrition["carbs"]}")
    views.setTextViewText(R.id.fat_value, "${consumedNutrition["fat"]} / ${targetNutrition["fat"]}")
    
    // Create intents for buttons
    val voiceIntent = Intent(Intent.ACTION_VIEW, Uri.parse("fitalic://input?input=voice"))
    val textIntent = Intent(Intent.ACTION_VIEW, Uri.parse("fitalic://input?input=keyboard"))
    
    // Create pending intents
    val pendingFlagType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    } else {
        PendingIntent.FLAG_UPDATE_CURRENT
    }
    
    val voicePendingIntent = PendingIntent.getActivity(context, 0, voiceIntent, pendingFlagType)
    val textPendingIntent = PendingIntent.getActivity(context, 1, textIntent, pendingFlagType)
    
    // Set click listeners on buttons
    views.setOnClickPendingIntent(R.id.voice_button, voicePendingIntent)
    views.setOnClickPendingIntent(R.id.text_button, textPendingIntent)
    
    // Update widget
    appWidgetManager.updateAppWidget(appWidgetId, views)
} 