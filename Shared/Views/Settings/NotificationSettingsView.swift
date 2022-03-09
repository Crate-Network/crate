//
//  NotificationSettingsView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/27/22.
//

import SwiftUI

struct NotificationSettingsView: View {
    @State var playSounds: Bool = true
    @State var selectedSize: Size = .large
    var body: some View {
        Toggle("Play notification sounds", isOn: $playSounds)

        Picker("Profile Image Size", selection: $selectedSize) {
            Text("Large").tag(Size.small)
            Text("Medium").tag(Size.medium)
            Text("Small").tag(Size.large)
        }
        #if os(macOS)
        .pickerStyle(.radioGroup)
        #endif
    }
}

struct NotificationSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        NotificationSettingsView()
    }
}
