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

// Model for widget data
struct WidgetData: TimelineEntry {
  let date: Date
  let consumed: NutritionData
  let target: NutritionData?
}

// App constants
struct AppConstants {
  static let appGroupIdentifier = "group.com.vitalii.nikopolidi.fitalic.shared"
  static let targetNutritionKey = "targetNutrition"
  static let consumedNutritionKey = "consumedNutrition"
}

// Provider for updating the widget
struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> WidgetData {
    WidgetData(
      date: Date(),
      consumed: NutritionData(calories: 3500, protein: 100, carbs: 100, fat: 50),
      target: NutritionData(calories: 2000, protein: 200, carbs: 200, fat: 50)
    )
  }
  
  func getSnapshot(in context: Context, completion: @escaping (WidgetData) -> Void) {
    let entry = getWidgetData()
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<WidgetData>) -> Void) {
    let entry = getWidgetData()
    let nextUpdateDate = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
    let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
    completion(timeline)
  }
  
  // Get data from UserDefaults in App Group
  private func getWidgetData() -> WidgetData {
    guard let sharedDefaults = UserDefaults(suiteName: AppConstants.appGroupIdentifier) else {
      return WidgetData(
        date: Date(),
        consumed: NutritionData.zero,
        target: nil
      )
    }
    
    let consumed = getNutritionData(from: sharedDefaults, key: AppConstants.consumedNutritionKey) ?? NutritionData.zero
    let target = getNutritionData(from: sharedDefaults, key: AppConstants.targetNutritionKey)
    
    return WidgetData(
      date: Date(),
      consumed: consumed,
      target: target
    )
  }
  
  private func getNutritionData(from defaults: UserDefaults, key: String) -> NutritionData? {
    guard let data = defaults.string(forKey: key),
          let jsonData = data.data(using: .utf8) else {
      return nil
    }
    
    do {
      let decoder = JSONDecoder()
      return try decoder.decode(NutritionData.self, from: jsonData)
    } catch {
      print("Error decoding \(key): \(error)")
      return nil
    }
  }
}

// Widget view with full container coverage for iOS 16+
struct WidgetEntryView: View {
  var entry: Provider.Entry
  @Environment(\.widgetFamily) var family
  
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
      
      VStack(spacing: 2) {
        // Top row with calories and fat
        HStack(spacing: 30) {
          // Calories progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.calories, target: entry.target?.calories),
            image: "calories",
            value: entry.consumed.calories,
            maxValue: entry.target?.calories
          )
          
          // Fat progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.fat, target: entry.target?.fat),
            image: "fat",
            value: entry.consumed.fat,
            maxValue: entry.target?.fat
          )
        }
        
        // Bottom row with protein and carbs
        HStack(spacing: 30) {
          // Protein progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.protein, target: entry.target?.protein),
            image: "protein",
            value: entry.consumed.protein,
            maxValue: entry.target?.protein
          )
          
          // Carbs progress
          CircularProgressView(
            progress: calculateProgress(current: entry.consumed.carbs, target: entry.target?.carbs),
            image: "carbs",
            value: entry.consumed.carbs,
            maxValue: entry.target?.carbs
          )
        }
        
        // Bottom row with microphone and keyboard
        HStack(spacing: 60) {
          // Voice input
          Link(destination: URL(string: "fitalic://voice-input")!) {
            Image(systemName: "mic")
              .font(.system(size: 20))
              .foregroundColor(.white)
          }
          
          // Text input
          Link(destination: URL(string: "fitalic://text-input")!) {
            Image(systemName: "keyboard")
              .font(.system(size: 20))
              .foregroundColor(.white)
          }
        }
        .padding(.top, 10)
      }
      .padding(15)
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

// Widget configuration
struct FitalicWidget: Widget {
  let kind: String = "fitalic_widget"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      WidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Fitalic")
    .description("Tracking calories and macronutrients")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

// Circular Progress View
struct CircularProgressView: View {
  let progress: CGFloat
  let image: String
  let value: Int?
  let maxValue: Int?
  
  var body: some View {
    ZStack {
      // Background circle
      Circle()
        .stroke(lineWidth: 6)
        .opacity(0.3)
        .foregroundColor(Color.gray)
      
      // Progress circle
      Circle()
        .trim(from: 0.0, to: progress)
        .stroke(style: StrokeStyle(lineWidth: 6, lineCap: .round))
        .foregroundColor(Color.pink)
        .rotationEffect(Angle(degrees: 270.0))
      
      // Center content
      VStack(spacing: 2) {
        // Image
        Image(image)
          .renderingMode(.template)
          .resizable()
          .scaledToFit()
          .frame(width: 25, height: 25)
          .foregroundColor(.white)
        
        // Value display
        VStack(spacing: 0) {
          // Show the current value, or 0 if nil
          Text("\(value ?? 0)")
            .font(.system(size: 12, weight: .bold))
            .foregroundColor(.white)
            .lineLimit(1)
            .minimumScaleFactor(0.7)
          
          // Conditionally show maxValue if it's not nil
          if let maxVal = maxValue {
            Text("\(maxVal)")
              .font(.system(size: 12, weight: .bold))
              .foregroundColor(.white)
              .lineLimit(1)
              .minimumScaleFactor(0.7)
          }
        }
      }
    }
    .frame(width: 60, height: 60)
  }
}

// Previews for Widget
struct WidgetPreviews: PreviewProvider {
  static var previews: some View {
    Group {
      // With goals
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        consumed: NutritionData(calories: 250, protein: 100, carbs: 100, fat: 50),
        target: NutritionData(calories: 2000, protein: 200, carbs: 200, fat: 50)
      ))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
      .previewDisplayName("С целями")
      
      // Without goals
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        consumed: NutritionData(calories: 350, protein: 100, carbs: 100, fat: 50),
        target: nil
      ))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
      .previewDisplayName("Без целей")
      
      // No data
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        consumed: NutritionData.zero,
        target: nil
      ))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
      .previewDisplayName("Нет данных")
      
      // Medium widget with goals
      WidgetEntryView(entry: WidgetData(
        date: Date(),
        consumed: NutritionData(calories: 350, protein: 100, carbs: 100, fat: 50),
        target: NutritionData(calories: 2000, protein: 200, carbs: 200, fat: 50)
      ))
      .previewContext(WidgetPreviewContext(family: .systemMedium))
      .previewDisplayName("Средний с целями")
    }
  }
}
