//
//  TabBar.swift
//  Crate (iOS)
//
//  Created by Chris Vanderloo on 2/27/22.
//

import SwiftUI

struct TabBar: View {
    private enum Tab: String {
        case home = "Home"
        case browse = "Browse"
        case files = "Files"
        case settings = "Settings"
    }
    
    @State private var selectedTab: Tab = .home
    var body: some View {
        TabView(selection: $selectedTab) {
            NavigationView {
                HomeView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label(Tab.home.rawValue, systemImage: "house")
            }
            .tag(Tab.home)
            
            NavigationView {
                BrowseView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label(Tab.browse.rawValue, systemImage: "network")
            }
            .tag(Tab.browse)

            NavigationView {
                FilesView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label(Tab.files.rawValue, systemImage: "doc.text")
            }
            .tag(Tab.files)
            
            NavigationView {
                SettingsView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .tabItem {
                Label(Tab.settings.rawValue, systemImage: "gearshape")
            }
            .tag(Tab.settings)
        }
    }
}

struct TabBar_Previews: PreviewProvider {
    static var previews: some View {
        TabBar()
    }
}
