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
        // initialize firebase
        FirebaseConstants.initialize()
        #if os(iOS)
        // modify font for navigation bar
        UINavigationBar.appearance().largeTitleTextAttributes = [.font : UIFont(name: "iA Writer Quattro S", size: 30)!]
        #endif
        
        let context = CoreDataManager.shared.persistentContainer.viewContext
        
        let rootFetchRequest: NSFetchRequest<Folder> = Folder.fetchRequest()
        rootFetchRequest.predicate = NSPredicate(format: "root == true")
        let rootFolder = try? context.fetch(rootFetchRequest).first
        if rootFolder == nil {
            let f = Folder(context: context)
            f.root = true
            f.cid = "root_container"
            try! context.save()
        }
        
        let trashFetchRequest: NSFetchRequest<Folder> = Folder.fetchRequest()
        trashFetchRequest.predicate = NSPredicate(format: "trash == true")
        let trashFolder = try? context.fetch(trashFetchRequest).first
        if trashFolder == nil {
            let f = Folder(context: context)
            f.trash = true
            f.cid = "trash_container"
            try! context.save()
        }
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
