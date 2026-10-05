import type { FC, PropsWithChildren, RefCallback } from 'react'

const BORDER_WIDTH = 1

const className = 'divide-y border bg-gray-50 shadow fixed'

const VIEWPORT_MARGIN = 4

const clampLeft = (element: HTMLElement, left: number): number => {
  const maxLeft = window.innerWidth - element.offsetWidth - VIEWPORT_MARGIN
  return Math.max(VIEWPORT_MARGIN, Math.min(left, maxLeft))
}

type Props = PropsWithChildren<{
  menuElement: HTMLDivElement
}>

const MenuItems: FC<Props> = ({ menuElement, children }) => {
  const refCallback: RefCallback<HTMLDivElement> = (element) => {
    if (element === null) {
      return
    }
    const { bottom: menuBottom, left: menuLeft } = menuElement.getBoundingClientRect()
    element.style.top = `${menuBottom - BORDER_WIDTH}px`
    element.style.left = `${clampLeft(element, menuLeft)}px`
  }

  return (
    <div ref={refCallback} className={className} role="menu">
      {children}
    </div>
  )
}

type ExpandedProps = PropsWithChildren<{
  innerRef: RefCallback<HTMLDivElement>
  menuItemElement: HTMLDivElement
}>

const Expanded: FC<ExpandedProps> = ({ innerRef, menuItemElement, children }) => {
  const refCallback: RefCallback<HTMLDivElement> = (element) => {
    innerRef(element)
    if (element === null) {
      return
    }
    const { top: menuItemTop, right: menuItemRight } = menuItemElement.getBoundingClientRect()
    const isParentFirstChild = menuItemElement.offsetTop === 0
    element.style.top = `${menuItemTop - (isParentFirstChild ? BORDER_WIDTH : 0)}px`
    element.style.left = `${clampLeft(element, menuItemRight)}px`
  }

  return (
    <div ref={refCallback} className={className} role="menu">
      {children}
    </div>
  )
}

if (import.meta.env.DEV) {
  Expanded.displayName = 'MenuItems.Expanded'
}

export default Object.assign(MenuItems, { Expanded })
