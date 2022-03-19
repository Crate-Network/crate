//
//  FileContextMenu.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/19/22.
//

import SwiftUI

struct FileContextMenu: View {
    @EnvironmentObject var fileStore: FileStore
    var file: File
    var body: some View {
        if file.fileType == .FOLDER {
            Button("Open in New Tab") {
                file.fileType = .FILE
            }
            
            Toggle("Favorited", isOn: $fileStore[file.id].favorited)
            
            Divider()
        }
        
        Button("Remove Download") { }
        
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
            
        }
    }
}

//struct FileContextMenu_Previews: PreviewProvider {
//    static var previews: some View {
//        FileContextMenu(file: File(name: "file.txt"))
//    }
//}
