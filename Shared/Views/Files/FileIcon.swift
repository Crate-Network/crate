//
//  FileIcon.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/16/22.
//

import SwiftUI

struct FileIcon: View {
    @EnvironmentObject var fileStore: FileStore
    
    @Binding var selection: Set<File.ID>
    
    var file: File
    var size: CGFloat
    
    var body: some View {
        VStack {
            Image(systemName: (file.contentType.sysImage() != nil) ? file.contentType.sysImage()! : file.fileType.sysImage())
                .resizable()
                .scaledToFit()
                .padding()
                .frame(width: size, height: size)
                .background {
                    if selection.contains(file.id) {
                        RoundedRectangle(cornerRadius: 2)
                            .foregroundColor(Color.init(white: 0.5, opacity: 0.5))
                    }
                }
            Text(file.fileName)
                .padding(.horizontal, 3)
                .background {
                    if selection.contains(file.id) {
                        RoundedRectangle(cornerRadius: 3)
                            .foregroundColor(Color(ColorType.primaryAction.name))
                    }
                }
        }
        .gesture(TapGesture(count: 2).onEnded {
            print("double clicked")
        })
        .simultaneousGesture(TapGesture().onEnded {
            selection = [file.id]
        })
        .contextMenu {
            FileContextMenu(file: file)
        }
    }
}

//struct FileIcon_Previews: PreviewProvider {
//    static var previews: some View {
//        FileIcon(size: 100, file: File(name: "file.txt"))
//    }
//}
