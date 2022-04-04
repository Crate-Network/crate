//
//  Sidebar.swift
//  Crate (macOS)
//
//  Created by Chris Vanderloo on 6/30/21.
//

import SwiftUI

struct Indicators: View {
    @State var filesStatus: FilesStatus = .idle
    var body: some View {
        VStack {
            IPFSIndicator()
            if filesStatus != .idle {
                FilesIndicator(
                    status: filesStatus,
                    dataDone: nil,
                    dataTotal: nil,
                    failure: false)
            }
        }
    }
}

enum PrimaryView: String {
    case allcontent, files, browse, settings, account
}

struct Sidebar: View {
    @Environment(\.managedObjectContext) var moc
    @FetchRequest(entity: Folder.entity(), sortDescriptors: [], predicate: NSPredicate(format: "favorited == true"))
    var favorites: FetchedResults<Folder>
    
    @State var selected: PrimaryView? = .allcontent
    @State var showSettings = false
    @State var settingsTapped = false
    
    #if os(macOS)
    @EnvironmentObject var navigationStack: NavigationStack
    #endif
    
    var body: some View {
        VStack {
            List {
                NavigationLink(tag: .files, selection: $selected, destination: {
                    #if os(macOS)
                    if navigationStack.stack.isEmpty {
                        FilesView()
                            .environmentObject(navigationStack)
                    } else {
                        FilesView(folder: navigationStack.stack.last!)
                            .environmentObject(navigationStack)
                    }
                    #else
                    FilesView()
                    #endif
                }, label: {
                    Label("All Files", systemImage: "tray.full")
                })
                
                NavigationLink(tag: .browse, selection: $selected, destination: {
                    BrowseView()
                }, label: {
                    Label("Browse", systemImage: "network")
                })
                
//                Section("Crates") {
//                    NavigationLink(tag: .files, selection: $selected, destination: {
//                        FilesView()
//                    }, label: {
//                        Label("Files", systemImage: "shippingbox")
//                    })
//                }
                
                if favorites.count > 0 {
                    Section("Favorites") {
                        ForEach(favorites) { favorite in
                            NavigationLink {
                                FilesView(folder: favorite)
                            } label: {
                                Label(favorite.wrappedName, systemImage: "folder")
                            }
                        }
                    }
                }
                
//                Section("Services") {
//                    Label("Music", systemImage: "music.note")
//                    Label("Photos", systemImage: "photo")
//                }
                
                Divider()
                HStack {
                    Label("Settings", systemImage: "gear")
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            #if os(iOS)
                            showSettings = true
                            #else
                            showPreferences()
                            #endif
                        }
                }
                
            }
            .listStyle(SidebarListStyle())
            Spacer()
            Indicators()
            #if os(macOS)
                .padding(.bottom)
            #else
                .padding()
            #endif
        }
        #if os(macOS)
        .toolbar() {
            ToolbarItem(placement: .primaryAction) {
                Button(action: toggleLeftSidebar, label: {
                    Image(systemName: "sidebar.leading")
                })
            }
        }
        #else
        .sheet(isPresented: $showSettings) {
            NavigationView {
                SettingsView()
                    .toolbar {
                        Button(action: {
                            showSettings = false
                        }, label: {
                            Image(systemName: "xmark.circle.fill")
                                .resizable()
                                .frame(width: 30, height: 30)
                                .scaledToFit()
                                .foregroundColor(.init(white: 0.6))
                        })
                    }
            }
        }
        #endif
        .navigationTitle("CRATE")
    }
    
    #if os(macOS)
    private func toggleLeftSidebar() {
        NSApp.keyWindow?.contentViewController?.tryToPerform(#selector(NSSplitViewController.toggleSidebar(_:)), with: nil)
    }
    
    private func showPreferences() {
        NSApp.sendAction(Selector(("showPreferencesWindow:")), to: nil, from: nil)
        
    }
    #endif
}

struct Sidebar_Previews: PreviewProvider {
    static var previews: some View {
        Sidebar()
            .environmentObject(IPFSCore())
    }
}
