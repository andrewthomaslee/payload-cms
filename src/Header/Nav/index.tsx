'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type NavLink = NavItem['link']

const getHref = (link: NavLink): string | null => {
  if (
    link?.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value.slug
  ) {
    return `${link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''}/${
      link.reference.value.slug
    }`
  }
  return link?.url ?? null
}

const normalize = (path: string | null): string => {
  if (!path) return ''
  const trimmed = path.replace(/\/+$/, '') || '/'
  return trimmed === '/home' ? '/' : trimmed
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const current = normalize(pathname)

  return (
    <nav className="flex items-center gap-8">
      <ul className="flex items-center gap-6">
        {navItems.map(({ link, subItems }, index) => {
          const hasChildren = Array.isArray(subItems) && subItems.length > 0
          const childActive =
            hasChildren && subItems.some((sub) => normalize(getHref(sub.link)) === current)
          const isActive = normalize(getHref(link)) === current || childActive

          return (
            <li key={index} className={hasChildren ? 'NavHasDropdown' : undefined}>
              <CMSLink {...link} appearance="link" className={isActive ? 'NavActive' : undefined}>
                {hasChildren && <ChevronDown className="NavChevron" aria-hidden="true" />}
              </CMSLink>

              {hasChildren && (
                <ul className="NavDropdown">
                  {subItems.map((sub, subIndex) => {
                    const subActive = normalize(getHref(sub.link)) === current

                    return (
                      <li key={subIndex}>
                        <CMSLink
                          {...sub.link}
                          appearance="link"
                          className={subActive ? 'NavActive' : undefined}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
