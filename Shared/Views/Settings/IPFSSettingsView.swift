//
//  IPFSSettingsView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/27/22.
//

import SwiftUI

struct IPFSSettingsView: View {
    @EnvironmentObject var ipfs: IPFSCore
    var body: some View {
        Section {
            Picker(selection: $ipfs.gateway) {
                ForEach(IPFSGateway.allCases, id: \.self) { gateway in
                    Text(gateway.getName())
                }
            } label: {
                #if os(macOS)
                Text("Gateway")
                #endif
            }
            .pickerStyle(.inline)
        } header: {
            SectionHeader("Gateway", true)
        } footer: {
            Text("The selected public gateway will be used when sharing your files.")
        }
        #if os(macOS)
        Divider()
        #endif
        Section {
            Toggle("Use JS-IPFS (Experimental)", isOn: $ipfs.useInternal)
        }
    }
}

struct IPFSSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        IPFSSettingsView()
            .environmentObject(IPFSCore())
    }
}
