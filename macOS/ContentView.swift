//
//  ContentView.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

struct ContentView: View {
    @Environment(\.managedObjectContext) var moc
    @FetchRequest(entity: Folder.entity(), sortDescriptors: [], predicate: NSPredicate(format: "root == true"))
    var rootFolders: FetchedResults<Folder>
    @ObservedObject var navigationStack: NavigationStack = NavigationStack()
    
    var body: some View {
        NavigationView {
            Sidebar()
                .frame(minWidth: 250)
                .environmentObject(navigationStack)
            
            if rootFolders.isEmpty {
                ProgressView().progressViewStyle(.circular)
            } else {
                if navigationStack.stack.isEmpty {
                    FilesView()
                        .frame(minWidth: 400, maxWidth: .infinity, maxHeight: .infinity)
                        .environmentObject(navigationStack)
                } else {
                    FilesView(folder: navigationStack.stack.last!)
                        .frame(minWidth: 400, maxWidth: .infinity, maxHeight: .infinity)
                        .environmentObject(navigationStack)
                }
            }
        }
        .frame(minWidth: 400, maxWidth: .infinity, minHeight: 500, maxHeight: .infinity)
    }
}
