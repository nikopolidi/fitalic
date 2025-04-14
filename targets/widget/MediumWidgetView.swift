import WidgetKit
import SwiftUI

// Widget view for medium size widget
struct MediumWidgetView: View {
  var entry: Provider.Entry
  
  var body: some View {
    if #available(iOSApplicationExtension 17.0, *) {
      contentView
        .containerBackground(.black, for: .widget)
    } else {
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        contentView
      }
    }
  }
  
  // Content of the widget
  private var contentView: some View {
    ZStack {
      Color.black.edgesIgnoringSafeArea(.all)
      
      HStack(spacing: 20) {
        // Left side - Progress circles
        VStack(spacing: 15) {
          // Calories progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.calories, target: entry.target?.calories),
            image: "calories",
            value: entry.consumed.calories,
            maxValue: entry.target?.calories
          )
          
          // Protein progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.protein, target: entry.target?.protein),
            image: "protein",
            value: entry.consumed.protein,
            maxValue: entry.target?.protein
          )
        }
        
        // Right side - Progress circles
        VStack(spacing: 15) {
          // Carbs progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.carbs, target: entry.target?.carbs),
            image: "carbs",
            value: entry.consumed.carbs,
            maxValue: entry.target?.carbs
          )
          
          // Fat progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.fat, target: entry.target?.fat),
            image: "fat",
            value: entry.consumed.fat,
            maxValue: entry.target?.fat
          )
        }
        
        // Bottom buttons
        VStack(spacing: 20) {
          // Voice input
          Link(destination: URL(string: "fitalic://voice-input")!) {
            Image(systemName: "mic")
              .font(.system(size: 24))
              .foregroundColor(.white)
          }
          
          // Text input
          Link(destination: URL(string: "fitalic://text-input")!) {
            Image(systemName: "keyboard")
              .font(.system(size: 24))
              .foregroundColor(.white)
          }
        }
      }
      .padding(20)
    }
  }
  
  // Calculate progress percentage (0.0 to 1.0)
  private func calculateProgress(current: Int, target: Int?) -> CGFloat {
    guard let target = target, target > 0 else {
      return 0.0
    }
    
    let progress = min(CGFloat(current) / CGFloat(target), 1.0)
    return progress
  }
}

// Medium Widget configuration
struct FitalicMediumWidget: Widget {
  let kind: String = "fitalic_medium_widget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      MediumWidgetView(entry: entry)
    }
    .configurationDisplayName("Fitalic Medium")
    .description("Tracking calories and macronutrients in medium size")
    .supportedFamilies([.systemMedium])
  }
}

// Previews for Medium Widget
struct MediumWidgetPreviews: PreviewProvider {
  static var previews: some View {
    Group {
      // With goals
      MediumWidgetView(entry: WidgetData(
        date: Date(),
        consumed: NutritionData(calories: 250, protein: 100, carbs: 100, fat: 50),
        target: NutritionData(calories: 2000, protein: 200, carbs: 200, fat: 50)
      ))
      .previewContext(WidgetPreviewContext(family: .systemMedium))
      .previewDisplayName("С целями")
      
      // Without goals
      MediumWidgetView(entry: WidgetData(
        date: Date(),
        consumed: NutritionData(calories: 350, protein: 100, carbs: 100, fat: 50),
        target: nil
      ))
      .previewContext(WidgetPreviewContext(family: .systemMedium))
      .previewDisplayName("Без целей")
      
      // No data
      MediumWidgetView(entry: WidgetData(
        date: Date(),
        consumed: NutritionData.zero,
        target: nil
      ))
      .previewContext(WidgetPreviewContext(family: .systemMedium))
      .previewDisplayName("Нет данных")
    }
  }
} 
