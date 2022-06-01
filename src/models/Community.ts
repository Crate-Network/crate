import { IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  faFaceGrin,
  faImage,
  faImagePortrait,
  faRobot,
} from "@fortawesome/free-solid-svg-icons"
import { VNode } from "preact"
import { JSXInternal } from "preact/src/jsx"

export type SidebarProps = {
  icon: IconProp
  text: string
  selected?: boolean
  onClick?: () => void
  children?: JSXInternal.Element[]
}

export enum CommunityPage {
  FEATURED,
  ALL_CATEGORIES,
  CATEGORY,
  SUBCATEGORY,
}

export type Category = {
  name: string
  key: string
  icon?: IconProp
  children?: Category[]
}

export type Subcategory = {
  name: string
  readonly key: string
  icon?: IconProp
}

export const makeChildCat = (name: string, key: string, icon?: IconProp) => ({
  name,
  key,
  icon,
})

export const makeCategory = (
  name: string,
  key: string,
  icon?: IconProp,
  children?: Subcategory[]
) => ({
  name,
  key,
  icon,
  children: children
    ? children.map((sub) => ({ ...sub, key: key + "-" + sub.key }))
    : undefined,
})

export const categories: Category[] = [
  makeCategory("Machine Learning", "ml", faRobot, [
    makeChildCat("Language", "language", faFaceGrin),
    makeChildCat("Images", "image", faImage),
  ]),
  makeCategory("Wallpapers", "wallpaper", faImagePortrait),
]
