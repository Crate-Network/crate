//
//  Color.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/2/22.
//

import SwiftUI

enum ColorType: String, CaseIterable {
    /// Branding colors
    case branding = "Orange"
    case secondaryBranding = "Brown"

    /// Text colors
    case headline = "Text"
    case subheadline = "SecondaryText"
    case subsubheadline = "TertiaryText"

    /// Button colors
    case primaryAction = "AccentColor"
    case secondaryAction = "AccentBlue"

    /// Background colors
    case background = "Background"
    case systemBackground = "SystemBackground"
    case secondaryBackground = "SecondaryBackground"

    var name: String {
        self.rawValue
    }
}

extension View {
  func color(_ color: ColorType) -> some View {
    self.foregroundColor(Color(color.name))
  }
    
  func background(_ color: ColorType) -> some View {
    self.background(Color(color.name))
  }
}

extension Shape {
    func fillCT(_ color: ColorType) -> some View {
        self.fill(Color(color.name))
    }

    func strokeCT(_ color: ColorType) -> some View {
        self.stroke(Color(color.name))
    }
}

extension Color {
    static func crate(_ color: ColorType) -> Color {
        return Color(color.name)
    }
}
