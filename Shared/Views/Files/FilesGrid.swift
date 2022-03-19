//
//  FilesGrid.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import SwiftUI

struct FilesGrid: View {
    @EnvironmentObject var fileStore: FileStore
    
    @Binding var selection: Set<File.ID>
    @Binding var sortOrder: [KeyPathComparator<File>]
    
    @State var iconSize = 100.0

    var body: some View {
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.adaptive(minimum: iconSize, maximum: .infinity), spacing: 10)
            ], spacing: 2) {
                ForEach(fileStore.files) { file in
                    FileIcon(selection: $selection, file: file, size: iconSize)
                        .padding()
                }
            }
            .padding()
        }
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
