//
//  CrateApp.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

@main
struct CrateApp: App {
    let persistentContainer = CoreDataManager.shared.persistentContainer
    
    @StateObject var ipfs: IPFSCore = IPFSCore()
    @StateObject var user: CrateUser = CrateUser()
    
    init() {
        FirebaseConstants.initialize()
        #if os(iOS)
        UINavigationBar.appearance().largeTitleTextAttributes = [.font : UIFont(name: "iA Writer Quattro S", size: 30)!]
        #endif
    }
    
    #if os(macOS)
    @State private var window: NSWindow?
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(ipfs)
                .environmentObject(user)
                .environment(\.managedObjectContext, persistentContainer.viewContext)
                .sheet(isPresented: $user.loggedIn.not) {
                    Authenticate()
                }
                .interactiveDismissDisabled()

        }
        .commands {
            SidebarCommands()
            user.loggedIn ? CommandGroup(after: .appInfo, addition: { }) : CommandGroup(replacing: .newItem, addition: { })
        }
        
        Settings {
            if user.loggedIn {
                SettingsView()
                    .frame(minWidth: 500, minHeight: 300, maxHeight: 500)
                    .multilineTextAlignment(.leading)
                    .environmentObject(ipfs)
                    .environmentObject(user)
                    .environment(\.managedObjectContext, persistentContainer.viewContext)
            } else {
                Text("Please log in or make an account.")
                    .frame(width: 200, height: 100)
            }
        }
    }
    #else
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(ipfs)
                .environmentObject(user)
                .environment(\.managedObjectContext, persistentContainer.viewContext)
        }
    }
    #endif
}

extension Binding where Value == Bool {
    var not: Binding<Value> {
        Binding<Value>(
            get: { !self.wrappedValue },
            set: { self.wrappedValue = !$0 }
        )
    }
}
