import { type FC, useState } from 'react'

import Anchor from '@/common/components/Anchor'
import { Help } from '@/common/components/icons'
import { REPOSITORY_URL } from '@/common/links'
import HelpDialog, { type HelpPage } from '@/features/help/HelpDialog'

import Menu from './Menu'
import MenuButton from './MenuButton'
import MenuItem from './MenuItem'
import MenuItems from './MenuItems'

const helpPages: { id: HelpPage, title: string }[] = [
  { id: 'start', title: 'Getting started' },
  { id: 'class', title: 'Using this in class' },
  { id: 'instructions', title: 'Instruction set' },
  { id: 'cambridge', title: 'Cambridge 9618 translation' },
  { id: 'mistakes', title: 'Common mistakes' },
  { id: 'memory', title: 'Memory & I/O' },
  { id: 'about', title: 'About' },
]

const HelpMenu: FC = () => {
  const [page, setPage] = useState<HelpPage | null>(null)

  return (
    <>
      <Menu label="Help">
        {(isOpen, hoverRef, menuElement) => (
          <>
            <MenuButton.Main ref={hoverRef}>
              <Help />
            </MenuButton.Main>
            {isOpen && (
              <MenuItems menuElement={menuElement}>
                {helpPages.map(({ id, title }) => (
                  <MenuItem key={id} onClick={() => setPage(id)}>
                    <MenuButton>
                      <span className="w-4" />
                      <span>{title}</span>
                    </MenuButton>
                  </MenuItem>
                ))}
                <Anchor className="flex space-x-4 py-1 px-2 items-center justify-between hover:bg-gray-200" href={REPOSITORY_URL}>
                  <MenuButton>
                    <span className="w-4" />
                    <span>Project on GitHub ↗</span>
                  </MenuButton>
                </Anchor>
              </MenuItems>
            )}
          </>
        )}
      </Menu>
      <HelpDialog page={page} onClose={() => setPage(null)} onPageChange={setPage} />
    </>
  )
}

export default HelpMenu
