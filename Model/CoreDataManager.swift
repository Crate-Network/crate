//
//  CrateDataManager.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/19/22.
//

import Foundation
import CoreData

class CoreDataManager {
    let persistentContainer: NSPersistentContainer
    static let shared: CoreDataManager = CoreDataManager()
    private init() {
        persistentContainer = NSPersistentContainer(name: "CrateModel")
        persistentContainer.loadPersistentStores { description, error in
            if let error = error {
                print("Core Data error: \(error)")
            }
        }
    }
}
