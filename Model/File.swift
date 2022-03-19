//
//  File.swift
//  Crate
//
//  Created by Chris Vanderloo on 3/16/22.
//

import Foundation
import UniformTypeIdentifiers

enum FileType: Codable {
    case FILE, FOLDER
}

extension FileType {
    func sysImage() -> String {
        switch self {
        case .FILE:
            return "doc"
        case .FOLDER:
            return "folder"
        }
    }
}

enum ContentType: Codable {
    case UNKNOWN, PLAINTEXT, RICHTEXT, DEV, MUSIC, VIDEO, SPREADSHEET
}

extension ContentType {
    func sysImage() -> String? {
        switch self {
        case .UNKNOWN:
            return nil
        case .PLAINTEXT:
            return "doc.plaintext"
        case .RICHTEXT:
            return "doc.richtext"
        case .DEV:
            return "hammer"
        case .MUSIC:
            return "headphones"
        case .VIDEO:
            return "film"
        case .SPREADSHEET:
            return "tablecells"
        }
    }
}

class File: ObservableObject, Identifiable, Codable {
    var id: UUID
    var fileName: String
    var fileType: FileType
    var favorited: Bool
    
    var fileExtension: String? { get {
        let ext = fileName.split(separator: ".").last
        if let ext = ext {
            return String(ext)
        }
        return nil
    }}
    
    var contentType: ContentType { get {
        switch fileExtension {
        case "txt":
            return .PLAINTEXT
        default:
            return .UNKNOWN
        }
    }}
    
    init(id: UUID = UUID(), name: String = "", fileType: FileType = .FILE, favorited: Bool = false) {
        self.id = id
        self.fileName = name
        self.fileType = fileType
        self.favorited = favorited
    }
}

extension File {
    static var draggableType = UTType(exportedAs: "com.chrisvanderloo.Crate.file")

    /// Extracts encoded plant data from the specified item providers.
    /// The specified closure will be called with the array of  resulting`Plant` values.
    ///
    /// Note: because this method uses `NSItemProvider.loadDataRepresentation(forTypeIdentifier:completionHandler:)`
    /// internally, it is currently not marked as `async`.
    static func fromItemProviders(_ itemProviders: [NSItemProvider], completion: @escaping ([File]) -> Void) {
        let typeIdentifier = Self.draggableType.identifier
        let filteredProviders = itemProviders.filter {
            $0.hasItemConformingToTypeIdentifier(typeIdentifier)
        }

        let group = DispatchGroup()
        var result = [Int: File]()

        for (index, provider) in filteredProviders.enumerated() {
            group.enter()
            provider.loadDataRepresentation(forTypeIdentifier: typeIdentifier) { (data, error) in
                defer { group.leave() }
                guard let data = data else { return }
                let decoder = JSONDecoder()
                guard let plant = try? decoder.decode(File.self, from: data)
                else { return }
                result[index] = plant
            }
        }

        group.notify(queue: .global(qos: .userInitiated)) {
            let plants = result.keys.sorted().compactMap { result[$0] }
            DispatchQueue.main.async {
                completion(plants)
            }
        }
    }
    
    var itemProvider: NSItemProvider {
        let provider = NSItemProvider()
        provider.registerDataRepresentation(forTypeIdentifier: Self.draggableType.identifier, visibility: .all) {
            let encoder = JSONEncoder()
            do {
                let data = try encoder.encode(self)
                $0(data, nil)
            } catch {
                $0(nil, error)
            }
            return nil
        }
        return provider
    }
}
