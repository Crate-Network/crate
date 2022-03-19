//
//  FileStore.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import Foundation

class FileStore: ObservableObject {
    @Published var files: [File] = [
        File(name: "folder", fileType: .FOLDER, favorited: true),
        File(name: "file1.txt"),
        File(name: "file2.txt"),
        File(name: "file3.txt")
    ]
    
    subscript(fileId: File.ID?) -> File {
        get {
            if let id = fileId {
                return files.first(where: { $0.id == id })!
            }
            return File()
        }

        set(newValue) {
            if let index = files.firstIndex(where: { $0.id == newValue.id }) {
                files[index] = newValue
                print(newValue)
            }
        }

    }
}
