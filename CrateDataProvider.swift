//
//  CrateDataProvider.swift
//  Crate
//
//  Created by Chris Vanderloo on 4/9/22.
//

import Foundation
import FileProviderUI
import CoreData

class CrateDataProvider {
    private static let context = CoreDataManager.shared.persistentContainer.viewContext
    
    static func fetchNode(for identifier: NSFileProviderItemIdentifier) throws -> UnixFSNode {
        let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "UnixFSNode")
        switch identifier {
        #if os(macOS)
        case .trashContainer:
            throw CrateDataError.NOT_IMPLEMENTED
        #endif
        case .rootContainer:
            fetchRequest.predicate = NSPredicate(format: "root == true")
        case .workingSet:
            fetchRequest.predicate = NSPredicate(format: "root == true")
        default:
            fetchRequest.predicate = NSPredicate(format: "cid == %@", identifier.rawValue)
        }
        let result = try! self.context.fetch(fetchRequest)
        return result.last as! UnixFSNode
    }
    
    static func isAvailable(_ identifier: NSFileProviderItemIdentifier) -> Bool {
        #if os(macOS)
        return identifier != .trashContainer
        #else
        return true
        #endif
    }
}

enum CrateDataError: Error {
    case NOT_IMPLEMENTED
}
