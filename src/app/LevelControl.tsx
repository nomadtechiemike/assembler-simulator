import type { FC } from 'react'

import { type Level, setLevel, useLevel } from './level'

const LevelControl: FC = () => {
  const level = useLevel()

  return (
    <label className="theme-control level-control">
      <span>Level</span>
      <select
        aria-label="Learning level"
        value={level}
        onChange={(event) => setLevel(event.target.value as Level)}>
        <option value="igcse">IGCSE (Y10-11)</option>
        <option value="alevel">AS/A Level (Y12-13)</option>
      </select>
    </label>
  )
}

export default LevelControl
