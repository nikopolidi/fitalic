import WidgetKit
import SwiftUI

// Nutrition data structure for both consumed and target values
struct NutritionData: Codable, Equatable {
  let calories: Int
  let protein: Int
  let carbs: Int
  let fat: Int
  
  static let zero = NutritionData(calories: 0, protein: 0, carbs: 0, fat: 0)
}

// Structure for decoding data saved in the app
struct SharedData: Codable {
  let consumed: NutritionData
  let target: NutritionData?
  let lastUpdated: String
}

// Model for widget data
struct WidgetData: TimelineEntry {
  let date: Date
  let widgetState: String
  let consumed: NutritionData
  let target: NutritionData?
}

// App constants
struct AppConstants {
  static let appGroupIdentifier = "group.com.vitalii.nikopolidi.fitalic.shared"
  static let widgetDataKey = "fitalic_widget_data"
}

// Provider for updating the widget
struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> WidgetData {
    WidgetData(
      date: Date(),
      widgetState: "Placeholder",
      consumed: NutritionData(calories: 3500, protein: 100, carbs: 100, fat: 50),
      target: NutritionData(calories: 2000, protein: 200, carbs: 200, fat: 50)
    )
  }
  
  func getSnapshot(in context: Context, completion: @escaping (WidgetData) -> Void) {
    let entry = getWidgetData()
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<WidgetData>) -> Void) {
    // Get widget data
    let entry = getWidgetData()
    
    // Update widget every hour
    let nextUpdateDate = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date()
    
    // Generate timeline for widget updates
    let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
    completion(timeline)
  }
  
  // Get data from UserDefaults in App Group
  private func getWidgetData() -> WidgetData {
    if let sharedDefaults = UserDefaults(suiteName: AppConstants.appGroupIdentifier) {
      if let savedData = sharedDefaults.string(forKey: AppConstants.widgetDataKey),
         let data = savedData.data(using: .utf8) {
        do {
          let decoder = JSONDecoder()
          let sharedData = try decoder.decode(SharedData.self, from: data)
          
          return WidgetData(
            date: Date(),
            widgetState: "Live",
            consumed: sharedData.consumed,
            target: sharedData.target
          )
        } catch {
          print("Error decoding widget data: \(error)")
        }
      }
    }
    
    // Return default data if saved data couldn't be retrieved
    return WidgetData(
      date: Date(),
      widgetState: "No Data",
      consumed: NutritionData.zero,
      target: nil
    )
  }
}

// Widget view with full container coverage for iOS 16+
struct WidgetEntryView: View {
  var entry: Provider.Entry
  @Environment(\.widgetFamily) var family
  
  var body: some View {
    // Widget content
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
    VStack(spacing: 0) {
      // Header
      HStack {
        Text("Consumption")
          .font(.system(size: 13, weight: .bold))
          .foregroundColor(.white)
        
        Spacer()
      }
      Spacer()
        .frame(height: 5)
      // Calories
      HStack {
        if let target = entry.target {
          Text("\(entry.consumed.calories)/\(target.calories)")
            .font(.system(size: 16, weight: .bold))
            .foregroundColor(.white)
            .lineLimit(1)
            .minimumScaleFactor(0.7)
        } else {
          Text("\(entry.consumed.calories)")
            .font(.system(size: 16, weight: .bold))
            .foregroundColor(.white)
        }
        
        Spacer()
      }
      
      Spacer()
        .frame(height: 0)
      
      // Macronutrients
      HStack(spacing: 10) {
        // Protein
        VStack(alignment: .leading, spacing: 0) {
          Text("Prot")
            .font(.system(size: 10))
            .foregroundColor(.white.opacity(0.7))
            .lineLimit(1)
          if let target = entry.target {
            Text("\(entry.consumed.protein)/\(target.protein)")
              .font(.system(size: 11))
              .foregroundColor(.white)
              .lineLimit(1)
              .minimumScaleFactor(0.8)
          } else {
            Text("\(entry.consumed.protein)")
              .font(.system(size: 11))
              .foregroundColor(.white)
              .lineLimit(1)
          }
        }
        .frame(maxWidth: .infinity)
        
        // Carbs
        VStack(alignment: .center, spacing: 0) {
          Text("Carbs")
            .font(.system(size: 10))
            .foregroundColor(.white.opacity(0.7))
            .lineLimit(1)
          if let target = entry.target {
            Text("\(entry.consumed.carbs)/\(target.carbs)")
              .font(.system(size: 11))
              .foregroundColor(.white)
              .lineLimit(1)
              .minimumScaleFactor(0.8)
          } else {
            Text("\(entry.consumed.carbs)")
              .font(.system(size: 11))
              .foregroundColor(.white)
              .lineLimit(1)
          }
        }
        .frame(maxWidth: .infinity)
        
        // Fat
        VStack(alignment: .trailing, spacing: 0) {
          Text("Fat")
            .font(.system(size: 10))
            .foregroundColor(.white.opacity(0.7))
            .lineLimit(1)
          
          if let target = entry.target {
            Text("\(entry.consumed.fat)/\(target.fat)")
              .font(.system(size: 11))
              .foregroundColor(.white)
              .lineLimit(1)
              .minimumScaleFactor(0.8)
          } else {
            Text("\(entry.consumed.fat)")
              .font(.system(size: 11))
              .foregroundColor(.white)
              .lineLimit(1)
          }
        }
        .frame(maxWidth: .infinity)
      }
      
      Spacer()
      
      // Action buttons
      HStack {
        // Voice input
        Link(destination: URL(string: "fitalic://voice-input")!) {
          Image(systemName: "mic")
            .font(.system(size: 17))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, maxHeight: 30)
        }
        
        // Text input
        Link(destination: URL(string: "fitalic://text-input")!) {
          Image(systemName: "keyboard")
            .font(.system(size: 17))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, maxHeight: 30)
        }
      }
    }
    .padding(10)
  }
}

// Widget configuration
struct FitalicWidget: Widget {
  let kind: String = "fitalic_widget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      WidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Fitalic")
    .description("Отслеживай потребление калорий и макронутриентов")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

// Main entry point
@main
struct MainWidget: WidgetBundle {
  var body: some Widget {
    FitalicWidget()
  }
}

// Previews for Widget
struct WidgetPreviews: PreviewProvider {
  static var previews: some View {
    Group {
      // With goals
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        widgetState: "Preview",
        consumed: NutritionData(calories: 3500, protein: 100, carbs: 100, fat: 50),
        target: NutritionData(calories: 2000, protein: 200, carbs: 200, fat: 50)
      ))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
      .previewDisplayName("С целями")
      
      // Without goals
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        widgetState: "Preview",
        consumed: NutritionData(calories: 350, protein: 100, carbs: 100, fat: 50),
        target: nil
      ))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
      .previewDisplayName("Без целей")
      
      // No data
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        widgetState: "No Data",
        consumed: NutritionData.zero,
        target: nil
      ))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
      .previewDisplayName("Нет данных")
      
      // Medium widget with goals
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        widgetState: "Preview",
        consumed: NutritionData(calories: 350, protein: 100, carbs: 100, fat: 50),
        target: NutritionData(calories: 2000, protein: 200, carbs: 200, fat: 50)
      ))
      .previewContext(WidgetPreviewContext(family: .systemMedium))
      .previewDisplayName("Средний с целями")
    }
  }
}
