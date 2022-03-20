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
    var favoritedBinding: Binding<Bool> {
        Binding {
            folder.favorited
        } set: { newValue in
            folder.favorited = newValue
            try? moc.save()
        }
    }
    var body: some View {
        Toggle("Favorited", isOn: favoritedBinding)
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
            FolderContextMenu(folder: folder)
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
