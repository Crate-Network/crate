//
//  StorageSettingsView.swift
//  Crate
//
//  Created by Chris Vanderloo on 2/27/22.
//

import SwiftUI

struct StorageSettingsView: View {
    @State var replicationFactor: Float = 7
    var replicationInt: Int { get {
        return Int(replicationFactor)
    }}
    var body: some View {
        Section {
            Text("Replication Factor: \(replicationInt)")
            Slider(value: $replicationFactor, in: 5...10, step: 1)
        } header: {
            SectionHeader("Data Replication")
        } footer: {
            Text("Every file will be replicated to the number of cold storage nodes you select. If any nodes lose your files, they will be copied and safely redistributed. Higher values are more secure against data loss, lower values are cheaper to store.")
        }
    }
}

struct StorageSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        StorageSettingsView()
    }
}
