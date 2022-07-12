//
//  QuickLook.swift
//  Crate (iOS)
//
//  Created by Chris Vanderloo on 5/8/22.
//

import Foundation
import UIKit
import SwiftUI
import QuickLook

struct QuickLookView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> QLPreviewController {
        return QLPreviewController()
    }
    
    func updateUIViewController(_ uiViewController: QLPreviewController, context: Context) {
        
    }
    
    
}
