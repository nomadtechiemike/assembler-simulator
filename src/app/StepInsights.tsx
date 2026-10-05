import { type FC, useEffect, useState } from 'react'

import { store, useSelector } from '@/app/store'
import { decToHex } from '@/common/utils'
import { selectAssembledSource } from '@/features/assembler/assemblerSlice'
import { selectCurrentStatementRange } from '@/features/controller/selectors'
import { selectCpuRegisters } from '@/features/cpu/cpuSlice'
import { selectMemoryData } from '@/features/memory/memorySlice'

import { explainInstruction } from './explain'
import { useLevel } from './level'

interface Change {
  label: string
  before: number
  after: number
}

const registerNames = ['AL', 'BL', 'CL', 'DL'] as const

const StepInsights: FC = () => {
  const source = useSelector(selectAssembledSource)
  const range = useSelector(selectCurrentStatementRange)
  const [changes, setChanges] = useState<Change[]>([])
  const [notice, setNotice] = useState('Step through the program to see changes here.')

  useEffect(() => {
    let previous = {
      registers: store.getState(selectCpuRegisters),
      memory: store.getState(selectMemoryData),
    }
    const pending = new Map<string, Change>()
    let timer: number | undefined
    const unsubscribe = store.subscribe(() => {
      const registers = store.getState(selectCpuRegisters)
      const memory = store.getState(selectMemoryData)
      const next: Change[] = []
      registers.gpr.forEach((value, index) => {
        if (value !== previous.registers.gpr[index]) {
          next.push({
            label: registerNames[index],
            before: previous.registers.gpr[index],
            after: value,
          })
        }
      })
      for (const name of ['ip', 'sp', 'sr'] as const) {
        if (registers[name] !== previous.registers[name]) {
          next.push({
            label: name.toUpperCase(),
            before: previous.registers[name],
            after: registers[name],
          })
        }
      }
      for (let address = 0; address < memory.length; address += 1) {
        if (memory[address] !== previous.memory[address]) {
          next.push({
            label: `RAM ${decToHex(address)}`,
            before: previous.memory[address],
            after: memory[address],
          })
        }
      }
      previous = { registers, memory }
      if (next.length > 0) {
        next.forEach((change) => pending.set(change.label, change))
        timer ??= window.setTimeout(() => {
          const latest = [...pending.values()]
          if (latest.length > 8 && latest.every(({ label }) => label.startsWith('RAM '))) {
            setChanges([])
            setNotice('Program loaded into memory. Press Step to follow its instructions.')
          }
          else {
            setChanges(latest.slice(0, 8))
            setNotice('')
          }
          pending.clear()
          timer = undefined
        })
      }
    })
    return () => {
      unsubscribe()
      window.clearTimeout(timer)
    }
  }, [])

  const level = useLevel()
  const instruction = range ? source.slice(range.from, range.to).trim() : ''
  const explanation = instruction ? explainInstruction(instruction) : null

  return (
    <section aria-label="Execution feedback" className="step-insights">
      <div className="eyebrow">Next instruction</div>
      <code className="next-instruction">{instruction || 'Assemble a program to begin'}</code>
      {explanation && (
        <div className="explanation">
          <p>{explanation.english}</p>
          {level === 'alevel' && explanation.rtn && (
            <p className="explanation-extra">
              <span>RTN</span> <code>{explanation.rtn}</code>
            </p>
          )}
          {level === 'alevel' && explanation.cambridge && (
            <p className="explanation-extra">
              <span>9618</span> <code>{explanation.cambridge}</code>
            </p>
          )}
        </div>
      )}
      <div className="eyebrow">Latest changes</div>
      {changes.length === 0
        ? <p className="muted">{notice}</p>
        : (
            <ul aria-live="polite" className="change-list">
              {changes.map(({ label, before, after }) => (
                <li key={label}>
                  <strong>{label}</strong>
                  <span>{decToHex(before)} → {decToHex(after)}</span>
                </li>
              ))}
            </ul>
          )}
    </section>
  )
}

export default StepInsights
