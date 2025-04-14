package com.fitalic.app.widget;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

public class FitalicWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.fitalic_widget);
            
            // Здесь будет логика обновления данных виджета
            views.setTextViewText(R.id.target_calories, "0");
            views.setTextViewText(R.id.target_protein, "0g");
            
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
} 