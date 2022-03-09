//
//  ContentView.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        #if os(iOS)
        if UIDevice.current.userInterfaceIdiom == .phone {
            TabBar()
        } else {
            NavigationView {
                Sidebar()
                FilesView()
            }
        }
        #else
        NavigationView {
            Sidebar()
                .frame(minWidth: 250)
            FilesView()
        }
        #endif
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ContentView()
        }
    }
}


