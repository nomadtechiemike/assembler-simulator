import { type FC, useCallback, useMemo, useState } from 'react'

import LevelControl from '@/app/LevelControl'
import type { ThemeChoice } from '@/app/theme'
import ThemeControl from '@/app/ThemeControl'
import Anchor from '@/common/components/Anchor'
import { Github } from '@/common/components/icons'
import { useOutsideClick, useStableHandler } from '@/common/hooks'
import { REPOSITORY_URL } from '@/common/links'

import ConfigurationMenu from './ConfigurationMenu'
import ControlButtons from './ControlButtons'
import ExecutionStatus from './ExecutionStatus'
import FileMenu from './FileMenu'
import HelpMenu from './HelpMenu'
import { MenuContext } from './Menu'
import ViewMenu from './ViewMenu'

interface Props {
  theme: ThemeChoice
  onThemeChange: (choice: ThemeChoice) => void
}

const ToolBar: FC<Props> = ({ theme, onThemeChange }) => {
  const [openMenu, __setOpenMenu] = useState<HTMLDivElement | null>(null)

  const setOpenMenu = useStableHandler((element: HTMLDivElement | null) => {
    __setOpenMenu(element)
    // eslint-disable-next-line react-hooks/immutability
    outsideClickRef(element)
  })

  const menuContextValue = useMemo(() => {
    return {
      currentOpen: openMenu,
      setCurrentOpen: setOpenMenu,
    }
  }, [openMenu, setOpenMenu])

  const handleOutsideClick = useCallback(() => {
    setOpenMenu(null)
  }, [setOpenMenu])
  const outsideClickRef = useOutsideClick(handleOutsideClick)

  return (
    <header className="workspace-header">
      <div className="workspace-header-main">
        <div className="workspace-brand">
          <h1>Assembler Simulator</h1>
          <Anchor href={REPOSITORY_URL}>
            <Github width="1.125rem" />
          </Anchor>
        </div>
        <ExecutionStatus />
        <LevelControl />
        <ThemeControl choice={theme} onChange={onThemeChange} />
      </div>
      <div className="workspace-actions">
        <MenuContext.Provider value={menuContextValue}>
          <div className="workspace-control-group">
            <ControlButtons />
          </div>
          <div className="workspace-menu-group">
            <FileMenu />
            <ViewMenu />
            <ConfigurationMenu />
            <HelpMenu />
          </div>
        </MenuContext.Provider>
      </div>
    </header>
  )
}

export default ToolBar
