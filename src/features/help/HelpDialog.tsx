import { type FC, useEffect } from 'react'

import Anchor from '@/common/components/Anchor'
import Modal from '@/common/components/Modal'
import { REPOSITORY_URL } from '@/common/links'

import GettingStarted from './GettingStarted'
import InstructionReference from './InstructionReference'
import MemoryAndIo from './MemoryAndIo'

export type HelpPage = 'start' | 'instructions' | 'memory' | 'about'

const pages: { id: HelpPage, title: string }[] = [
  { id: 'start', title: 'Getting started' },
  { id: 'instructions', title: 'Instruction set' },
  { id: 'memory', title: 'Memory & I/O' },
  { id: 'about', title: 'About' },
]

interface Props {
  page: HelpPage | null
  onClose: () => void
  onPageChange: (page: HelpPage) => void
}

const About: FC = () => (
  <div className="help-prose">
    <p className="help-lead">An 8-bit assembly workspace for learning how instructions change memory, registers, and output devices.</p>
    <div className="help-card">
      <h3>About this project</h3>
      <p>This fork adds a responsive workspace, guided practice, theme choices, and local help to the original Assembler Simulator by Exuanbo.</p>
      <p>Version {__VERSION__} · Build {__COMMIT_HASH__.slice(0, 7)}</p>
      <p><Anchor href={REPOSITORY_URL}>Project on GitHub ↗</Anchor> · <Anchor href={`${REPOSITORY_URL}/blob/main/LICENSE`}>GPL-3.0 License ↗</Anchor></p>
    </div>
    <p>Instruction set based on the Samphire sms32v50 Microprocessor Simulator. This local guide describes the features implemented here; the original project and its license remain credited in the README.</p>
  </div>
)

const HelpDialog: FC<Props> = ({ page, onClose, onPageChange }) => {
  const isOpen = page !== null

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const previousFocus = document.activeElement
    return () => {
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus()
      }
    }
  }, [isOpen])

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
    }
    if (event.key !== 'Tab') {
      return
    }
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input'))
      .filter((element) => !element.hasAttribute('disabled'))
    const first = focusable[0]
    const last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first && last) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && document.activeElement === last && first) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <Modal className="help-overlay" isOpen={isOpen}>
      <div
        aria-label="Help"
        aria-modal="true"
        className="help-dialog"
        role="dialog"
        onKeyDown={handleKeyDown}>
        <header className="help-dialog-header">
          <div>
            <span className="eyebrow">Assembler Simulator</span>
            <h2>Help</h2>
          </div>
          <button autoFocus aria-label="Close help" className="help-close" type="button" onClick={onClose}>✕</button>
        </header>
        <div className="help-dialog-body">
          <nav aria-label="Help topics" className="help-nav">
            {pages.map(({ id, title }) => (
              <button
                key={id}
                aria-current={page === id ? 'page' : undefined}
                type="button"
                onClick={() => onPageChange(id)}>
                {title}
              </button>
            ))}
          </nav>
          <main key={page} className="help-content">
            <span className="eyebrow">Local guide</span>
            <h2 id="help-page-title">{pages.find(({ id }) => id === page)?.title}</h2>
            {page === 'start' && <GettingStarted />}
            {page === 'instructions' && <InstructionReference />}
            {page === 'memory' && <MemoryAndIo />}
            {page === 'about' && <About />}
          </main>
        </div>
      </div>
    </Modal>
  )
}

export default HelpDialog
