//
//  FileProviderItem.swift
//  CrateFilesAppProvider
//
//  Created by Chris Vanderloo on 2/21/22.
//

import FileProvider
import UniformTypeIdentifiers

class FileProviderItem: NSObject, NSFileProviderItem {
    let node: UnixFSNode

    // TODO: implement an initializer to create an item from your extension's backing model
    // TODO: implement the accessors to return the values from your extension's backing model
    
    init(_ node: UnixFSNode) {
        self.node = node
    }
    
    var itemIdentifier: NSFileProviderItemIdentifier {
        return NSFileProviderItemIdentifier(node.cid!)
    }
    
    var parentItemIdentifier: NSFileProviderItemIdentifier {
        return NSFileProviderItemIdentifier(node.parent!)
    }
    
    var capabilities: NSFileProviderItemCapabilities {
        return [.allowsReading, .allowsWriting, .allowsRenaming, .allowsReparenting, .allowsTrashing, .allowsDeleting]
    }
    
    var filename: String {
        return node.name!
    }
    
    var contentType: UTType {
        if let folder = node as? Folder {
            return .folder
        }
        return .plainText
    }
    
}
