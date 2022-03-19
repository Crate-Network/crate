//
//  ContentView.swift
//  Shared
//
//  Created by Chris Vanderloo on 6/13/21.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authentication: CrateAuthentication
    var body: some View {
        NavigationView {
            Sidebar()
                .frame(minWidth: 250)
            
            FilesView()
                .frame(minWidth: 400, maxWidth: .infinity, maxHeight: .infinity)
                
        }
        .frame(minWidth: 400, maxWidth: .infinity, minHeight: 500, maxHeight: .infinity)
        
    }
}

//struct ContentView_Previews: PreviewProvider {
//    static var previews: some View {
//        Group {
//            ContentView()
//        }
//    }
//}


