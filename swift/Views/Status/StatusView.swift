//
//  StatusView.swift
//  Crate (macOS)
//
//  Created by Chris Vanderloo on 2/22/22.
//

import SwiftUI

enum Status {
    case failure, warning, success, idle
}

func getColorForStatus(status: Status) -> Color {
    switch status {
    case .failure:
        return .red
    case .warning:
        return .yellow
    case .success:
        return .green
    case .idle:
        return .gray
    }
}

extension Status {
    func getColor() -> Color {
        return getColorForStatus(status: self)
    }
}

struct StatusIndicator<Content: View>: View {
    var statusText: String
    var imageSystemName: String?
    var indicator: Status
    var progress: Float? // out of 100
    var endStatusText: String?
    let endStatusView: Content?
    
    init(_ statusText: String, imageSystemName: String? = nil, indicator: Status, progress: Float? = nil,  endStatusView: (() -> Content)? = nil) {
        self.statusText = statusText
        self.imageSystemName = imageSystemName
        self.indicator = indicator
        self.progress = progress
        self.endStatusText = nil
        self.endStatusView = endStatusView?()
    }
    
    var body: some View {
        VStack {
            HStack {
                if let imageSystemName = imageSystemName {
                    Image(systemName: imageSystemName )
                        .resizable()
                        .foregroundColor(indicator.getColor())
                        .scaledToFill()
                        .frame(width: 20, height: 20)
                        .aspectRatio(contentMode: .fit)
                }
                Text(statusText)
                    .font(.callout)
                Spacer()
                if let endStatusView = endStatusView {
                    endStatusView
                }
                if let endStatusText = endStatusText {
                    Text(endStatusText)
                        .foregroundColor(.gray)
                        .font(.callout)
                }
            }
            if let progress = progress {
                ProgressView(value: progress, total: 100)
                    .frame(height: 10)
            }
        }
        .padding(.vertical, 1)
        #if os(macOS)
        .padding(.horizontal, 20)
        #else
        .padding(.horizontal, 4)
        #endif
    }
}

extension StatusIndicator where Content == EmptyView {
    init(_ statusText: String, imageSystemName: String? = nil, indicator: Status, progress: Float? = nil, endStatus: String) {
        self.init(statusText, imageSystemName: imageSystemName, indicator: indicator, progress: progress)
        self.endStatusText = endStatus
    }
}

struct StatusIndicator_Preview: PreviewProvider {
    static var previews: some View {
        StatusIndicator("Text", imageSystemName: "doc", indicator: .failure, progress: 20, endStatus: "Text")
    }
}
