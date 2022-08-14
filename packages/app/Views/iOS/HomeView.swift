//
//  HomeView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/28/22.
//

import SwiftUI

@MainActor
class UrlImageModel: ObservableObject {
    @Published var image: UIImage?
    var urlString: String?
    
    init(urlString: String?) {
        self.urlString = urlString
    }
    
    func loadImage() throws {
        Task {
            try await loadImageFromUrl()
        }
    }
    
    func loadImageFromUrl() async throws {
        guard let urlString = urlString else {
            return
        }
        
        let url = URL(string: urlString)!
        let (data, _) = try await URLSession.shared.data(from: url)
        
        guard let loadedImage = UIImage(data: data) else {
            return
        }
        print("LOADED IMAGE")
        self.image = loadedImage
    }
}

struct HomeView: View {
    @ObservedObject var urlImageModel: UrlImageModel
    init() {
        urlImageModel = UrlImageModel(urlString: "http://192.168.0.210:8080/ipfs/Qmb3LFLazGdxce9GWehYmEx1ct8wvXv92QPvk53kuR7St1")
    }
    
    var body: some View {
        VStack {
            Text("Home")
            Button {
                do {
                    try urlImageModel.loadImage()
                } catch {
                    print("ERROR: \(error)")
                }
                
            } label: {
                Text("Fetch IPFS")
            }
            
            if let image = urlImageModel.image {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 500, height: 500)
            }
        }
        .navigationTitle("Home")
        
        
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
