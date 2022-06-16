//
//  ContentView.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var user: CrateUser
    var body: some View {
        if UIDevice.current.userInterfaceIdiom == .phone {
            TabBar()
                .sheet(isPresented: $user.loggedIn.not) {
                    Authenticate()
                        .interactiveDismissDisabled(true)
                }
        } else {
            NavigationView {
                Sidebar()
                FilesView()
            }
            .sheet(isPresented: $user.loggedIn.not) {
                Authenticate()
            }
            .interactiveDismissDisabled()
        }
    }
}

//struct ContentView_Previews: PreviewProvider {
//    static var previews: some View {
//        Group {
//            ContentView()
//        }
//    }
//}
