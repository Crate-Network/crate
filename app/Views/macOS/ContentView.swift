//
//  ContentView.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

struct ContentView: View {
    @ObservedObject var navigationStack: NavigationStack = NavigationStack()
    
    var body: some View {
        NavigationView {
            Sidebar()
                .frame(minWidth: 250)
                .environmentObject(navigationStack)
            
            ProgressView()
        }
        .frame(minWidth: 400, maxWidth: .infinity, minHeight: 500, maxHeight: .infinity)
    }
}
