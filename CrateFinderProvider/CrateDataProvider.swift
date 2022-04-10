//
//  CrateDataProvider.swift
//  Crate
//
//  Created by Chris Vanderloo on 4/9/22.
//

import Foundation
import FileProviderUI

class CrateDataProvider {
    private static let context: NSManagedObjectContext = CoreDataManager.shared.persistentContainer.viewContext
    
    static func fetchNode(for identifier: NSFileProviderItemIdentifier) -> UnixFSNode {
        let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "UnixFSNode")
        switch identifier {
        case .trashContainer:
            fetchRequest.predicate = NSPredicate(format: "trash == true")
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
}
