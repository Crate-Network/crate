//
//  FilesView.swift
//  Crate (macOS)
//
//  Created by Chris Vanderloo on 2/22/22.
//

import SwiftUI

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
    
    @Environment(\.managedObjectContext) var moc
    @FetchRequest(entity: UnixFSNode.entity(), sortDescriptors: []) var nodes: FetchedResults<UnixFSNode>
    
    var body: some View {
        VStack {
            switch selectedDisplay {
            case .icon:
                FilesGrid(selection: $selection)
            case .list:
                FilesList(selection: $selection, sortOrder: $sortOrder)
            case .column:
                FilesColumn()
            }
        }
        .navigationTitle("All Files")
        #if os(macOS)
        .navigationSubtitle("23 Files")
        #endif
        .toolbar {
            ToolbarItem(placement: .navigation) {
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
                HStack {
                    Menu {
                        FileDisplayPicker(selectedDisplay:  $selectedDisplay)
                    } label: {
                        Image(systemName: selectedDisplay.rawValue)
                    }
                    Menu {
                        SortingTypePicker()
                    } label: {
                        Image(systemName: "arrow.up.arrow.down")
                    }
                }
                #else
                FileDisplayPicker(selectedDisplay: $selectedDisplay)
                SortingTypePicker()
                Spacer()
//                Button(action: toggleRightSidebar, label: {
//                    Image(systemName: "sidebar.trailing")
//                })
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
        let file = File(context: moc)
        file.name = "file.txt"
        try? moc.save()
    }
    
    private func newFolder() {
        let folder = Folder(context: moc)
        folder.name = "folder"
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
