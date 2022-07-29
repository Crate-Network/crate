import { Link } from "preact-router"
import { useState } from "preact/hooks"
import DarkGlyph from "../assets/dark-crate-glyph.svg"

type Breadcrumb = {
  name: string
  link: string
}

interface FooterProps {
  breadcrumbs: Breadcrumb[]
}

export default function Footer({ breadcrumbs }: FooterProps) {
  return (
    <div className="w-full bg-orange-50 dark:bg-black p-12 text-orange-900 text-sm dark:text-slate-300 block">
      <div className="flex items-center">
        <Link href="/">
          <span className="font-iaQuattro text-3xl font-bold hover:underline hover:text-neutral-400">
            CRATE
          </span>
        </Link>
        {breadcrumbs.map(({ name, link }) => (
          <span key={link}>
            <span className="font-light inline-block ml-3 mr-3 text-slate-500 text-lg">
              &gt;
            </span>
            <Link
              className="hover:text-neutral-400 hover:underline"
              href={link}
            >
              {name}
            </Link>
          </span>
        ))}
      </div>
      <span className="block h-px bg-slate-500 mb-2 mt-2" />
      <div className="flex justify-between">
        <span>Copyright © 2022 Crate Network, LLC. All rights reserved.</span>
        <span className="space-x-4">
          <span>Terms of Use</span>
          <span className="text-slate-500 text-lg">|</span>
          <span>Privacy Policy</span>
        </span>
      </div>
    </div>
  )
}
