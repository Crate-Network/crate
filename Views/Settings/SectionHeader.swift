//
//  SectionHeader.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import SwiftUI

struct SectionHeader: View {
    var text: String
    var hiddenOnMac: Bool
    init(_ text: String, _ hideOnMac: Bool = true) {
        self.text = text
        self.hiddenOnMac = hideOnMac
    }
    var body: some View {
        #if os(macOS)
        if hiddenOnMac {
            EmptyView()
        } else {
            Text(text)
                .font(.headline)
                .padding(.top, 10)
        }
        #else
        Text(text)
        #endif
    }
}

struct SectionHeader_Previews: PreviewProvider {
    static var previews: some View {
        SectionHeader("test")
    }
}
