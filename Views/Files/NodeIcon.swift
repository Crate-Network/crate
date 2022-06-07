//
//  FileIcon.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/16/22.
//

import SwiftUI
import UniformTypeIdentifiers

struct NodeIcon: View {
    @Environment(\.managedObjectContext) var moc
    
    @Binding var selection: Set<UnixFSNode.ID>
    @FocusState var focusField: Bool
    @State var renaming: Bool = false
    @State var size: CGFloat
    @State var isNavigatedTo: Bool = false
    
    @ObservedObject var node: UnixFSNode
    @State var nodeName: String = ""
    
    #if os(macOS)
    @EnvironmentObject var navigationStack: NavigationStack
    #endif
    
    var body: some View {
        VStack {
            if let folder = node as? Folder {
                #if os(iOS)
                NavigationLink(isActive: $isNavigatedTo) {
                    FilesView(folder: folder)
                } label: { }
                #endif
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
                    .foregroundColor(selection.contains(node.id) ? Color.white : Color(ColorType.headline.name))
                    .padding(.horizontal, 3)
                    .background {
                        if selection.contains(node.id) {
                            RoundedRectangle(cornerRadius: 3)
                                .foregroundColor(Color(ColorType.primaryAction.name))
                        }
                    }
            }
        }
        #if os(macOS)
        .gesture(TapGesture(count: 2).onEnded {
            if let folder = node as? Folder {
                navigationStack.push(folder)
            }
        })
        .simultaneousGesture(TapGesture().onEnded {
            selection = [node.id]
        })
        #else
        .gesture(TapGesture().onEnded {
            isNavigatedTo = true
        })
        #endif
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
        .onDrag {
            return NSItemProvider(item: node.cid! as NSString, typeIdentifier: "public.plain-text")
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
    @ObservedObject var file: File
    var body: some View {
        Image(systemName: "doc.fill")
            .resizable()
            .scaledToFit()
            .padding()
            .font(.system(size: 40, weight: .ultraLight, design: .default))
            .foregroundColor(Color(ColorType.branding.name))
            .frame(width: size, height: size)
            .background {
                if selection.contains(file.id) {
                    RoundedRectangle(cornerRadius: 5)
                        .foregroundColor(Color.init(white: 0.5, opacity: 0.3))
                }
            }
    }
}

struct FolderImage: View {
    @Binding var selection: Set<UnixFSNode.ID>
    @Binding var size: CGFloat
    @ObservedObject var folder: Folder
    @State var isTargeted: Bool = false
    var body: some View {
        Image(systemName: "folder.fill")
            .resizable()
            .scaledToFit()
            .padding()
            .font(.system(size: 40, weight: .ultraLight, design: .default))
            .foregroundColor(Color(ColorType.branding.name))
            .frame(width: size, height: size)
            .background {
                if selection.contains(folder.id) || isTargeted {
                    RoundedRectangle(cornerRadius: 2)
                        .foregroundColor(Color.init(white: 0.5, opacity: 0.5))
                }
            }
            .onDrop(of: [UTType.plainText, UTType.fileURL], isTargeted: $isTargeted) { (providers: [NSItemProvider]) in
                providers.forEach { (itemProvider: NSItemProvider) in
                    print(itemProvider.description)
                }
                return true
            }
    }
}

//struct FileIcon_Previews: PreviewProvider {
//    static var previews: some View {
//        FileIcon(size: 100, file: File(name: "file.txt"))
//    }
//}
