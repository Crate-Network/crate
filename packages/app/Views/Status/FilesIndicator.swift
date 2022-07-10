//
//  FilesStatus.swift
//  Crate (macOS)
//
//  Created by Chris Vanderloo on 2/22/22.
//

import SwiftUI

enum FilesStatus: String {
    case uploading = "Uploading"
    case downloading = "Downloading"
    case idle = "Idle"
}

extension FilesStatus {
    func getIcon() -> String {
        switch self {
        case .uploading:
            return "arrow.up.doc.fill"
        case .downloading:
            return "arrow.down.doc.fill"
        case .idle:
            return "doc.fill"
        }
    }
    
    func getStatusColor(failure: Bool?) -> Status {
        if failure ?? false {
            return .failure
        }
        switch self {
        case .uploading:
            return .success
        case .downloading:
            return .success
        case .idle:
            return .idle
        }
    }
}

struct FilesIndicator: View {
    var status: FilesStatus
    var dataDone: Float?
    var dataTotal: Float?
    var failure: Bool?
    var body: some View {
        if let dataDone = dataDone, let dataTotal = dataTotal {
            StatusIndicator(status.rawValue, imageSystemName: status.getIcon(), indicator: status.getStatusColor(failure: failure), progress: (dataDone / dataTotal) * 100, endStatus: "\(dataDone) MB")
        } else {
            StatusIndicator(
                status.rawValue,
                imageSystemName: status.getIcon(),
                indicator: status.getStatusColor(failure: failure),
                endStatus: "")
        }
    }
}

struct FilesIndicator_Preview: PreviewProvider {
    static var previews: some View {
        FilesIndicator(status: .downloading, dataDone: 13.3, dataTotal: 30, failure: false)
    }
}
