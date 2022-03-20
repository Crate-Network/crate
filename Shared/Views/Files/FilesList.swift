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
    @FetchRequest(entity: UnixFSNode.entity(), sortDescriptors: []) var nodes: FetchedResults<UnixFSNode>
    @Binding var selection: Set<UnixFSNode.ID>
    @Binding var sortOrder: [KeyPathComparator<UnixFSNode>]
    
    #if os(macOS)
    var body: some View {
        Table(selection: $selection, sortOrder: $sortOrder) {
            TableColumn("Name", value: \.wrappedName)
        } rows: {
            ForEach(nodes) { node in
                TableRow(node)
            }
        }
    }
    #else
    var body: some View {
        List(nodes, selection: $selection, rowContent: { node in
            Text(node.wrappedName)
        })
    }
    #endif
}
