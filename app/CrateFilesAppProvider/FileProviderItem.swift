//
//  FileProviderItem.swift
//  CrateFilesAppProvider
//
//  Created by Chris Vanderloo on 2/21/22.
//

import FileProvider
import UniformTypeIdentifiers

class FileProviderItem: NSObject, NSFileProviderItem {
    // TODO: implement an initializer to create an item from your extension's backing model
    // TODO: implement the accessors to return the values from your extension's backing model
    
    private let identifier: NSFileProviderItemIdentifier
    private let node: UnixFSNode
    
    init(identifier: NSFileProviderItemIdentifier) {
        self.identifier = identifier
        self.node = try! CrateDataProvider.fetchNode(for: identifier)
    }
    
    var itemIdentifier: NSFileProviderItemIdentifier {
        return identifier
    }
    
    var parentItemIdentifier: NSFileProviderItemIdentifier {
        if let parentCID = node.parent?.cid {
            return NSFileProviderItemIdentifier(parentCID)
        }
        return .rootContainer
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
