//
//  FilesTable.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import SwiftUI

extension UnixFSNode {
    var wrappedName: String { get {
        self.name ?? ""
    }}
}

struct FilesList: View {
    @Environment(\.managedObjectContext) var moc
    @Binding var selection: Set<UnixFSNode.ID>
    @Binding var sortOrder: [KeyPathComparator<UnixFSNode>]
    @ObservedObject var folder: Folder
    @FetchRequest var children: FetchedResults<UnixFSNode>
    
    init(_ folder: Folder, with selection: Binding<Set<UnixFSNode.ID>>, sortedBy sortOrder: Binding<[KeyPathComparator<UnixFSNode>]>) {
        self.folder = folder
        _selection = selection
        _sortOrder = sortOrder
        _children  = FetchRequest(
            entity: UnixFSNode.entity(),
            sortDescriptors: [
                NSSortDescriptor(keyPath: \UnixFSNode.name, ascending: true)
            ],
            predicate: NSPredicate(format: "parent == %@", folder)
        )
    }
    
    #if os(macOS)
    var body: some View {
        Table(selection: $selection, sortOrder: $sortOrder) {
            TableColumn("Name", value: \.wrappedName)
        } rows: {
            ForEach(children) { node in
                TableRow(node)
            }
        }
    }
    
    #else
    var body: some View {
        List(nodes, selection: $selection, rowContent: { node in
            NavigationLink(destination: {
                Text(node.wrappedName)
            }, label: {
                Text(node.wrappedName)
            })
            .contextMenu {
                Button(action: {
                    // delete item in items array
               }) {
                   Text("Delete")
               }
            }
            
        })
    }
    #endif
}
