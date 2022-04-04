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
        let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "UnixFSNode")
        fetchRequest.predicate = NSPredicate(format: "cid == %@", identifier.rawValue)
        let result = try! fetchRequest.execute()
        self.node = result.last as! UnixFSNode
    }
    
    var itemIdentifier: NSFileProviderItemIdentifier {
        return NSFileProviderItemIdentifier(rawValue: node.cid!)
    }
    
    var parentItemIdentifier: NSFileProviderItemIdentifier {
        return .rootContainer
    }
    
    var capabilities: NSFileProviderItemCapabilities {
        return [.allowsReading, .allowsWriting, .allowsRenaming, .allowsReparenting, .allowsDeleting]
    }
    
    var itemVersion: NSFileProviderItemVersion {
        NSFileProviderItemVersion(contentVersion: "a content version".data(using: .utf8)!, metadataVersion: "a metadata version".data(using: .utf8)!)
    }
    
    var filename: String {
        return node.name!
    }
    
    var contentType: UTType {
        return ((node as? Folder) != nil) ? .folder : .plainText
    }
}
