import { type FC, useState } from 'react'

import ToolBar from '@/features/controller/Toolbar'
import Editor from '@/features/editor/Editor'
import ErrorBoundary from '@/features/exception/ErrorBoundary'
import ExceptionModal from '@/features/exception/ExceptionModal'
import { useGlobalExceptionHandler } from '@/features/exception/hooks'

import { useAckee } from './hooks'
import ReloadPrompt from './ReloadPrompt'
import ResizablePanel from './ResizablePanel'
import StatePanel from './StatePanel'
import { useTheme } from './theme'

const App: FC = () => {
  useGlobalExceptionHandler()
  useAckee()
  const { choice, setChoice } = useTheme()
  const [mobileView, setMobileView] = useState<'code' | 'state'>('code')

  return (
    <>
      <div className="workspace-shell">
        <ToolBar theme={choice} onThemeChange={setChoice} />
        <nav aria-label="Workspace view" className="mobile-view-switch">
          <button
            aria-pressed={mobileView === 'code'}
            type="button"
            onClick={() => setMobileView('code')}>
            Code
          </button>
          <button
            aria-pressed={mobileView === 'state'}
            type="button"
            onClick={() => setMobileView('state')}>
            CPU &amp; output
          </button>
        </nav>
        <ResizablePanel className={`workspace-panels mobile-view-${mobileView}`}>
          <ErrorBoundary>
            <Editor />
          </ErrorBoundary>
          <StatePanel />
        </ResizablePanel>
      </div>
      <ReloadPrompt />
      <ExceptionModal />
    </>
  )
}

export default App
