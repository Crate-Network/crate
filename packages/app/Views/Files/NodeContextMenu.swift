//
//  FileContextMenu.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/19/22.
//

import SwiftUI

struct FileContextMenu: View {
    var file: File
    var body: some View {
        Text("File Specific Items Here")
    }
}

struct FolderContextMenu: View {
    @Environment(\.managedObjectContext) var moc
    var folder: Folder
    @State var favorited: Bool
    var body: some View {
        Button(favorited ? "Unfavorite" : "Favorite") {
            favorited = !folder.favorited
            folder.favorited = !folder.favorited
            try? moc.save()
        }
    }
}

struct NodeContextMenu: View {
    @Environment(\.managedObjectContext) var moc
    let node: UnixFSNode
    let rename: () -> Void
    var body: some View {
        Button("Open in New Tab") {
            
        }
        
        Button("Rename") {
            rename()
        }
        
        Divider()
        
        if let folder = node as? Folder {
            FolderContextMenu(folder: folder, favorited: folder.favorited)
        }
        
        if let file = node as? File {
            FileContextMenu(file: file)
        }
        
        Divider()
        
        Menu("Share") {
            Button("Share with Link") { }
            Button("Share to Email") { }
        }
        
        Button("Open on Web") {
            
        }

        Button("Copy CID") {
            
        }
        
        Button("Delete") {
            moc.delete(node)
            try? moc.save()
        }
    }
}

//struct FileContextMenu_Previews: PreviewProvider {
//    static var previews: some View {
//        FileContextMenu(file: File(name: "file.txt"))
//    }
//}
