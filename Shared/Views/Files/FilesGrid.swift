//
//  FilesGrid.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import SwiftUI

struct FilesGrid: View {
    @Binding var selection: Set<UnixFSNode.ID>
    @State var iconSize = 100.0
    
    @Environment(\.managedObjectContext) var moc
    @FetchRequest(entity: UnixFSNode.entity(), sortDescriptors: []) var nodes: FetchedResults<UnixFSNode>

    var body: some View {
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: iconSize, maximum: .infinity), spacing: 10)
            ], spacing: 2) {
                ForEach(nodes) { node in
                    NodeIcon(selection: $selection, size: iconSize, node: node)
                        .padding()
                }
            }
            .padding()
        }
        #if os(macOS)
        .contextMenu {
            Button("New Folder") {
                let folder = Folder(context: moc)
                folder.name = "Untitled"
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
