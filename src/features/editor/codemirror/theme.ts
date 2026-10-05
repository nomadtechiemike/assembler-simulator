import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { InternalClassName } from './classNames'

export const theme = (): Extension => {
  return EditorView.theme({
    '&': {
      height: '100%',
      backgroundColor: 'var(--surface)',
      color: 'var(--text)',
    },
    [`&.${InternalClassName.Focused}`]: {
      outline: '0',
    },
    [`.${InternalClassName.Scroller}`]: {
      cursor: 'text',
      fontFamily: "'Jetbrains Mono', monospace",
    },
    [`.${InternalClassName.Gutters}`]: {
      borderRight: '1px solid var(--border)',
      backgroundColor: 'var(--surface-muted)',
      cursor: 'initial',
      color: 'var(--muted)',
    },
    [`.${InternalClassName.Cursor}`]: {
      borderLeft: '2px solid var(--text)',
    },
    [`&:not(.${InternalClassName.Focused}) .${InternalClassName.CursorPrimary}`]: {
      outline: '0 !important',
    },
  })
}
