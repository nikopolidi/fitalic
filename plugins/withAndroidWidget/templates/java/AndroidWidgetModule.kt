package com.vitalii.nikopolidi.fitalic.widget

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise

class AndroidWidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "AndroidWidgetModule"
    private val PREFS_NAME = "com.vitalii.nikopolidi.fitalic.shared"
    private val TARGET_NUTRITION = "targetNutrition"
    private val CONSUMED_NUTRITION = "consumedNutrition"

    override fun getName(): String {
        return "AndroidWidgetModule"
    }

    private fun getSharedPreferences(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    @ReactMethod
    fun setTargetNutrition(data: ReadableMap, promise: Promise) {
        try {
            val jsonString = mapToJsonString(data)
            val editor = getSharedPreferences().edit()
            editor.putString(TARGET_NUTRITION, jsonString)
            editor.apply()
            
            // Update widget
            FitalicWidget.updateAllWidgets(reactApplicationContext)
            
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error setting target nutrition: ${e.message}")
            promise.reject("ERROR", "Failed to set target nutrition: ${e.message}")
        }
    }

    @ReactMethod
    fun setConsumedNutrition(data: ReadableMap, promise: Promise) {
        try {
            val jsonString = mapToJsonString(data)
            val editor = getSharedPreferences().edit()
            editor.putString(CONSUMED_NUTRITION, jsonString)
            editor.apply()
            
            // Update widget
            FitalicWidget.updateAllWidgets(reactApplicationContext)
            
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "Error setting consumed nutrition: ${e.message}")
            promise.reject("ERROR", "Failed to set consumed nutrition: ${e.message}")
        }
    }

    private fun mapToJsonString(map: ReadableMap): String {
        val json = StringBuilder()
        json.append("{")
        
        if (map.hasKey("calories")) {
            json.append("\"calories\":${map.getInt("calories")},")
        }
        if (map.hasKey("protein")) {
            json.append("\"protein\":${map.getInt("protein")},")
        }
        if (map.hasKey("carbs")) {
            json.append("\"carbs\":${map.getInt("carbs")},")
        }
        if (map.hasKey("fat")) {
            json.append("\"fat\":${map.getInt("fat")}")
        }
        
        // Remove trailing comma if present
        if (json[json.length - 1] == ',') {
            json.deleteCharAt(json.length - 1)
        }
        
        json.append("}")
        return json.toString()
    }
} 