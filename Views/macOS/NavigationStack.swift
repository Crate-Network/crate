//
//  NavigationStack.swift
//  Crate (macOS)
//
//  Created by Chris Vanderloo on 4/3/22.
//

import Foundation

class NavigationStack: ObservableObject {
    @Published var stack: [Folder] = []
    @Published var forwardStack: [Folder] = []
    
    func moveBack() {
        let folder = stack.popLast()
        if let folder = folder {
            forwardStack.append(folder)
        }
    }
    
    func moveForward() {
        let folder = forwardStack.popLast()
        if let folder = folder {
            stack.append(folder)
        }
    }
    
    func push(_ folder: Folder) {
        stack.append(folder)
        forwardStack.removeAll()
    }
    
    func canGoBack() -> Bool {
        return !stack.isEmpty
    }
    
    func canGoForward() -> Bool {
        return !forwardStack.isEmpty
    }
    
    func clear() {
        stack = []
        forwardStack = []
    }
}
