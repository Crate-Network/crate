//
//  BrowseView.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/1/22.
//

import SwiftUI
import WebKit

struct BrowseView: View {
    @State var searchText: String = ""
    @State var imageData: Data? = nil
    @State var errorShown: Bool = false
    @State var error: String? = nil
    @EnvironmentObject var ipfs: IPFSCore
    var body: some View {
        VStack {
            Text("Not implemented yet.")
                .searchable(text: $searchText)
                .navigationTitle("Browse")
                .task {
                    do {
                        self.imageData = try await ipfs.getData("Qmb3LFLazGdxce9GWehYmEx1ct8wvXv92QPvk53kuR7St1")
                    } catch {
                        self.error = error.localizedDescription
                        errorShown = true
                    }
                }
                .alert("Error", isPresented: $errorShown, actions: {
                    Button("OK", role: .cancel) {}
                }, message: {
                    Text(self.error ?? "")
                })
            
//            if let imageData = imageData {
//                #if os(macOS)
//                Image(nsImage: NSImage(data: imageData))
//                    .resizable()
//                    .scaledToFit()
//                    .frame(width: 500, height: 500)
//                #else
//                Image(uiImage: UIImage(data: imageData))
//                    .resizable()
//                    .scaledToFit()
//                    .frame(width: 500, height: 500)
//                #endif
//            }
        }
    }
}
