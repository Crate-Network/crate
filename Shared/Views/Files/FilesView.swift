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
    @State var selection: Set<File.ID> = Set([])
    @State var sorting: [KeyPathComparator<File>] = [
        .init(\.fileName, order: .forward)
    ]
    var body: some View {
        VStack {
            switch selectedDisplay {
            case .icon:
                FilesGrid(selection: $selection, sortOrder: $sorting)
            case .list:
                FilesList(selection: $selection, sortOrder: $sorting)
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
                    Button("Import File", action: addFile)
                    Button("Add IPFS CID", action: addIPFSCID)
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
                Button(action: toggleRightSidebar, label: {
                    Image(systemName: "sidebar.trailing")
                })
                #endif
            }
        }
        #if os(iOS)
        .searchable(text: $searchText,
                    placement: .navigationBarDrawer)
        #else
        .searchable(text: $searchText)
        #endif
    }
    
    private func toggleRightSidebar() {
        
    }
    
    private func addFile() {
        
    }
    
    private func addIPFSCID() {
        
    }
}


//struct FilesView_Previews: PreviewProvider {
//    static var previews: some View {
//        FilesView()
//    }
//}
