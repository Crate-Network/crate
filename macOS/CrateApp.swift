//
//  CrateApp.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

@main
struct CrateApp: App {
    @StateObject var ipfs = IPFSCore()
    @StateObject var account = Account()
    
    @State private var window: NSWindow?
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(ipfs)
                .environmentObject(account)
                .frame(minWidth: 800, maxWidth: .infinity, maxHeight: .infinity)
                .sheet(isPresented: $account.loggedIn.not) {
                    Authenticate()
                        .environmentObject(account)
                }
                .interactiveDismissDisabled()

        }
        .commands {
            SidebarCommands()
            self.account.loggedIn ? CommandGroup(after: .appInfo, addition: { }) : CommandGroup(replacing: .newItem, addition: { })
        }
        
        Settings {
            if account.loggedIn {
                SettingsView()
                    .frame(width: 500, height: 400)
                    .multilineTextAlignment(.leading)
                    .environmentObject(ipfs)
                    .environmentObject(account)
            } else {
                Text("Please log in or make an account.")
                    .frame(width: 200, height: 100)
            }
        }
        
    }
}


extension Binding where Value == Bool {
    var not: Binding<Value> {
        Binding<Value>(
            get: { !self.wrappedValue },
            set: { self.wrappedValue = !$0 }
        )
    }
}
