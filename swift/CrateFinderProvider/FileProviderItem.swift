//
//  FileProviderItem.swift
//  CrateFinderProvider
//
//  Created by Chris Vanderloo on 2/21/22.
//

import FileProvider
import UniformTypeIdentifiers
import CoreData

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
        return [.allowsReading, .allowsWriting, .allowsRenaming, .allowsReparenting, .allowsDeleting]
    }
    
    var itemVersion: NSFileProviderItemVersion {
        return NSFileProviderItemVersion(contentVersion: "a content version".data(using: .utf8)!, metadataVersion: "a metadata version".data(using: .utf8)!)
    }
    
    var filename: String {
        return node.name ?? "Crate Root"
    }
    
    var contentType: UTType {
        return ((node as? Folder) != nil) ? .folder : .plainText
    }
}
