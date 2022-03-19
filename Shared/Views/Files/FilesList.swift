//
//  FilesTable.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import SwiftUI

struct FilesList: View {
    @EnvironmentObject var fileStore: FileStore
    @Binding var selection: Set<File.ID>
    @Binding var sortOrder: [KeyPathComparator<File>]
    
    #if os(macOS)
    var body: some View {
        Table(selection: $selection, sortOrder: $sortOrder) {
            TableColumn("Name", value: \.fileName) { file in
                Text(file.fileName)
            }
        } rows: {
            ForEach(fileStore.files) { file in
                TableRow(file)
                    .itemProvider { file.itemProvider }
            }
        }
    }
    #else
    var body: some View {
        List(fileStore.files, selection: $selection, rowContent: { file in
            Label(file.fileName, image: file.fileType.sysImage())
        })
    }
    #endif
}
