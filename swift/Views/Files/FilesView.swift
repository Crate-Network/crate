//
//  FilesView.swift
//  Crate (macOS)
//
//  Created by Chris Vanderloo on 2/22/22.
//

import SwiftUI
import CoreData
import UniformTypeIdentifiers

enum FileDisplay: String, CaseIterable, Identifiable {
    case icon = "square.grid.2x2"
    case list = "list.bullet"
    case column = "rectangle.split.3x1"
    
    var id: Self { self }
}

extension FileDisplay {
    func getDesc() -> String {
        switch self {
        case .icon:
            return "Icons"
        case .list:
            return "List"
        case .column:
            return "Columns"
        }
    }
}

enum SortingType: String, CaseIterable, Identifiable {
    case name = "Name"
    case kind = "Kind"
    case application = "Application"
    case createdOn = "Date Created"
    
    var id: Self { self }
}

struct FileDisplayPicker: View {
    @Binding var selectedDisplay: FileDisplay
    var body: some View {
        Picker("File Display", selection: $selectedDisplay) {
            ForEach(FileDisplay.allCases) { display in
                Label {
                    Text(display.getDesc())
                } icon: {
                    Image(systemName: display.rawValue)
                }
            }
        }
        #if os(macOS)
        .pickerStyle(.segmented)
        #endif
    }
}

struct SortingTypePicker: View {
    @State var sorting: SortingType = .name
    var body: some View {
        Picker(selection: $sorting, content: {
            ForEach(SortingType.allCases) { sortingType in
                Text(sortingType.rawValue)
            }
        }, label: {})
    }
}

struct FilesView: View {
    @State var searchText: String = ""
    @State var selectedDisplay: FileDisplay = .icon
    @State var selection = Set<UnixFSNode.ID>()
    @State var sortOrder: [KeyPathComparator<UnixFSNode>] = [
        .init(\.name, order: SortOrder.forward)
    ]
    
    @State var sheetShown: Bool = false
    @State var cid: String = ""
    @State var filename: String = ""
    @State var isTargeted: Bool = false
    
    @Environment(\.managedObjectContext) var moc
    @ObservedObject var folder: Folder
    var titleBar: String = "All Files"
    
    let showingRoot: Bool
    
    #if os(macOS)
    @EnvironmentObject var navigationStack: NavigationStack
    #endif
    
    init() {
        self.init(folder: nil)
    }
    
    init(folder: Folder?) {
        if let folder = folder {
            self.titleBar = folder.wrappedName
            self.folder = folder
            self.showingRoot = false
        } else {
            let fetchRequest: NSFetchRequest<Folder> = Folder.fetchRequest()
            fetchRequest.predicate = NSPredicate(format: "root == true")
            let context = CoreDataManager.shared.persistentContainer.viewContext
            let rootFolder = try? context.fetch(fetchRequest).first
            if let rootFolder = rootFolder {
                self.folder = rootFolder
            } else {
                let context = CoreDataManager.shared.persistentContainer.viewContext
                let f = Folder(context: context)
                f.root = true
                f.cid = "nothingyet"
                self.folder = f
                try! context.save()
            }
            self.showingRoot = true
        }
    }
    
    var body: some View {
        VStack {
            switch selectedDisplay {
            case .icon:
                FilesGrid(folder, with: $selection)
            case .list:
                FilesList(folder, with: $selection, sortedBy: $sortOrder)
            case .column:
                FilesColumn()
            }
        }
        .onDrop(of: [UTType.plainText, UTType.fileURL], isTargeted: $isTargeted, perform: { providers in
            providers.forEach { item in
                if (item.registeredTypeIdentifiers().contains { $0 == UTType.plainText.identifier
                }) {
                    print("text")
                } else if (item.registeredTypeIdentifiers().contains { $0 == UTType.fileURL.identifier
                }) {
                    item.loadFileRepresentation(forTypeIdentifier: UTType.fileURL.identifier) { url, err in
                        if let err = err {
                            print(err)
                        }
                        guard url != nil else {
                            print("Failed to unwrap URL")
                            return
                        }
                        // url exists
                        
                    }
                }
            }
            return true
        })
        .navigationTitle(titleBar)
        #if os(macOS)
        .navigationSubtitle("\(folder.children?.count ?? 0) Files")
        #endif
        .toolbar {
            #if os(macOS)
            ToolbarItem(placement: .navigation) {
                Button(action: {
                    navigationStack.moveBack()
                }, label: {
                    Image(systemName: "chevron.left")
                })
                .disabled(!navigationStack.canGoBack())
                .keyboardShortcut("[", modifiers: .command)
            }
            ToolbarItem(placement: .navigation) {
                Button(action: {
                    navigationStack.moveForward()
                }, label: {
                    Image(systemName: "chevron.right")
                })
                .disabled(!navigationStack.canGoForward())
                .keyboardShortcut("]", modifiers: .command)
            }
            #endif
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button("New File", action: newFile)
                    Button("New Folder", action: newFolder)
                    Divider()
                    Button("Import File", action: addFile)
                    Button("Import IPFS CID", action: addIPFSCID)
                } label: {
                    Image(systemName: "plus")
                }
            }
            ToolbarItemGroup {
                #if os(iOS)
                Menu {
                    FileDisplayPicker(selectedDisplay:  $selectedDisplay)
                    Divider()
                    SortingTypePicker()
                } label: {
                    Image(systemName: selectedDisplay.rawValue)
                }
                #else
                FileDisplayPicker(selectedDisplay: $selectedDisplay)
                SortingTypePicker()
                #endif
            }
        }
        .sheet(isPresented: $sheetShown) {
            VStack {
                Text("Add CID").font(.headline)
                TextField("CID", text: $cid)
                    .frame(minWidth: 200)
                TextField("File Name (Optional)", text: $filename)
                    .frame(minWidth: 200)
                Button("Add") {
                    let file = File(context: moc)
                    file.name = filename == "" ? cid : filename
                    file.cid = cid
                    file.size = 80
                    
                    try? moc.save()
                    sheetShown = false
                }
            }
            .padding()
        }
        #if os(iOS)
        .searchable(text: $searchText,
                    placement: .navigationBarDrawer)
        #else
        .searchable(text: $searchText)
        #endif
    }
    
//    private func toggleRightSidebar() {
//
//    }
    
    private func newFile() {
        let newFile = File(context: moc)
        newFile.name = "file.txt"
        newFile.cid = "sdfffff"
        folder.addToChildren(newFile)
        try? moc.save()
    }
    
    private func newFolder() {
        let newFolder = Folder(context: moc)
        newFolder.name = "folder"
        newFolder.cid = "sfghhshsh"
        folder.addToChildren(newFolder)
        try? moc.save()
    }
    
    private func addFile() {
        
    }
    
    private func addIPFSCID() {
        sheetShown = true
    }
}


//struct FilesView_Previews: PreviewProvider {
//    static var previews: some View {
//        FilesView()
//    }
//}