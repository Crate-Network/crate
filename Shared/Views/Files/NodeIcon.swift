//
//  FileIcon.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/16/22.
//

import SwiftUI

struct NodeIcon: View {
    @Environment(\.managedObjectContext) var moc
    
    @Binding var selection: Set<UnixFSNode.ID>
    @FocusState var focusField: Bool
    @State var renaming: Bool = false
    @State var size: CGFloat
    
    var node: UnixFSNode
    @State var nodeName: String = ""
    
    var body: some View {
        VStack {
            if let folder = node as? Folder {
                FolderImage(selection: $selection, size: $size, folder: folder)
            } else if let file = node as? File {
                FileImage(selection: $selection, size: $size, file: file)
            }
            if renaming {
                TextField("", text: $nodeName)
                    .focused($focusField)
                    .frame(maxWidth: size)
                    .fixedSize()
                    .onSubmit {
                        renaming = false
                        setName(name: nodeName)
                    }
            } else {
                Text(node.wrappedName)
                    .fontWeight(.medium)
                    .shadow(radius: 1)
                    .padding(.horizontal, 3)
                    .background {
                        if selection.contains(node.id) {
                            RoundedRectangle(cornerRadius: 3)
                                .foregroundColor(Color(ColorType.primaryAction.name))
                        }
                    }
            }
        }
        .gesture(TapGesture(count: 2).onEnded {
            print("double clicked")
        })
        .simultaneousGesture(TapGesture().onEnded {
            selection = [node.id]
        })
        .contextMenu {
            NodeContextMenu(node: node, rename: {
                renaming = true
                focusField = true
            })
        }
        .onChange(of: focusField) { newValue in
            if !newValue {
                renaming = false
            }
        }
    }
    
    private func setName(name: String) {
        node.name = name
        try? moc.save()
    }
}

struct FileImage: View {
    @Binding var selection: Set<UnixFSNode.ID>
    @Binding var size: CGFloat
    var file: File
    var body: some View {
        Image(systemName: "doc")
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
    }
}

struct FolderImage: View {
    @Binding var selection: Set<UnixFSNode.ID>
    @Binding var size: CGFloat
    var folder: Folder
    var body: some View {
        Image(systemName: "folder")
            .resizable()
            .scaledToFit()
            .padding()
            .frame(width: size, height: size)
            .background {
                if selection.contains(folder.id) {
                    RoundedRectangle(cornerRadius: 2)
                        .foregroundColor(Color.init(white: 0.5, opacity: 0.5))
                }
            }
    }
}

//struct FileIcon_Previews: PreviewProvider {
//    static var previews: some View {
//        FileIcon(size: 100, file: File(name: "file.txt"))
//    }
//}
