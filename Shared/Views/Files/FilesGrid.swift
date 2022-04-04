//
//  FilesGrid.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import SwiftUI
import CoreData

struct FilesGrid: View {
    @Environment(\.managedObjectContext) var moc
    @Binding var selection: Set<UnixFSNode.ID>
    @State var iconSize = 100.0
    @ObservedObject var folder: Folder
    @FetchRequest var children: FetchedResults<UnixFSNode>
    
    init(_ folder: Folder, with selection: Binding<Set<UnixFSNode.ID>>) {
        self.folder    = folder
        self._selection = selection
        self._children  = FetchRequest(
            entity: UnixFSNode.entity(),
            sortDescriptors: [
                NSSortDescriptor(keyPath: \UnixFSNode.name, ascending: true)
            ],
            predicate: NSPredicate(format: "parent == %@", folder)
        )
    }
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: iconSize, maximum: .infinity), spacing: 10)
            ], spacing: 2) {
                ForEach(children) { node in
                    NodeIcon(selection: $selection, size: iconSize, node: node)
                        .padding()
                }
            }
            .padding()
        }
        #if os(macOS)
        .contextMenu {
            Button("New Folder") {
                let newFolder = Folder(context: moc)
                newFolder.name = "Untitled"
                folder.addToChildren(newFolder)
                try? moc.save()
            }
        }
        #endif
        .onTapGesture {
            selection = []
        }
    }
}

//struct FilesGrid_Previews: PreviewProvider {
//    static var previews: some View {
//        FilesGrid()
//    }
//}
