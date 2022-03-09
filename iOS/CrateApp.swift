//
//  CrateApp.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

@main
struct CrateApp: App {
    @StateObject var ipfs = IPFSCore()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(ipfs)
        }
    }
}
