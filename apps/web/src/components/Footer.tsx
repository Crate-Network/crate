type Breadcrumb = {
  name: string
  link: string
}

export interface FooterProps {
  breadcrumbs: Breadcrumb[]
}

export function Footer({ breadcrumbs }: FooterProps) {
  return (
    <div className="w-full bg-white dark:bg-black h-12 block">
      <h1>Welcome Footer!</h1>
    </div>
  )
}

export default Footer
