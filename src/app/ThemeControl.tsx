import type { FC } from 'react'

import type { ThemeChoice } from './theme'

interface Props {
  choice: ThemeChoice
  onChange: (choice: ThemeChoice) => void
}

const ThemeControl: FC<Props> = ({ choice, onChange }) => (
  <label className="theme-control">
    <span>Theme</span>
    <select
      aria-label="Colour theme"
      value={choice}
      onChange={(event) => onChange(event.target.value as ThemeChoice)}>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
)

export default ThemeControl
