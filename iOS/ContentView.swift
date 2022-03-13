//
//  ContentView.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var account: Account
    var body: some View {
        if UIDevice.current.userInterfaceIdiom == .phone {
            if account.loggedIn {
                TabBar()
            }
            if !account.loggedIn {
                Authenticate()
                    .transition(.move(edge: .bottom).animation(.easeInOut(duration: 0.3)))
            }
        } else {
            NavigationView {
                Sidebar()
                FilesView()
            }
            .sheet(isPresented: $account.loggedIn.not) {
                Authenticate()
                    .environmentObject(account)
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

extension Binding where Value == Bool {
    var not: Binding<Value> {
        Binding<Value>(
            get: { !self.wrappedValue },
            set: { self.wrappedValue = !$0 }
        )
    }
}
