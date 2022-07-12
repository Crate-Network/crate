//
//  IPFSStatus.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/27/22.
//

import SwiftUI

struct IPFSIndicator: View {
    @EnvironmentObject var ipfs: IPFSCore
    
    func getIPFSStatus() -> String {
        switch self.ipfs.status {
        case .connected:
            return "Connected"
        case .establishing:
            return "Establishing"
        case .disconnected:
            return "Disconnected"
        case .error:
            return "Error"
        }
    }
    
    var body: some View {
        StatusIndicator(
            "IPFS",
            imageSystemName: "antenna.radiowaves.left.and.right.circle.fill",
            indicator: ipfs.status.getStatus()) {
                VStack(alignment: .trailing) {
                    Text(getIPFSStatus())
                        .foregroundColor(Color.crate(.subheadline))
                        .lineLimit(1)
                    Text("IPFS Node")
                        .foregroundColor(Color.crate(.subsubheadline))
                        .fontWeight(.bold)
                        .font(.footnote)
                        .lineLimit(1)
                        .dynamicTypeSize(.small)
                }
                
            }
    }
    
    func endView<Content: View>(_ ipfsCore: IPFSCore, @ViewBuilder content: @escaping () -> Content) -> some View {
        return StatusIndicator(
            "IPFS Node",
            imageSystemName: "antenna.radiowaves.left.and.right.circle.fill",
            indicator: ipfsCore.status.getStatus(),
            endStatusView: content)
    }
}

struct IPFSStatus_Previews: PreviewProvider {
    static var previews: some View {
        IPFSIndicator()
            .environmentObject(IPFSCore())
    }
}
