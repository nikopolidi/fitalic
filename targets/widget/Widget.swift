import WidgetKit
import SwiftUI

// This file contains helper functions for WidgetKit
// It ensures the correct API methods are available

@available(iOS 14.0, *)
class WidgetHelper {
    static func reloadAllWidgets() {
        WidgetCenter.shared.reloadAllTimelines()
    }
    
    static func reloadWidget(kind: String) {
        WidgetCenter.shared.reloadTimelines(ofKind: kind)
    }
}

@main
struct FitalicWidgets: WidgetBundle {
  var body: some Widget {
    FitalicWidget()
  }
} 