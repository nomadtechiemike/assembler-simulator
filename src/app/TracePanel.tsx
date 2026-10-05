import { type FC, useEffect, useState } from 'react'

import { store } from '@/app/store'
import { decToHex } from '@/common/utils'
import { selectAddressToStatementMap, selectAssembledSource } from '@/features/assembler/assemblerSlice'
import { MAX_SP, StatusRegisterFlag } from '@/features/cpu/core'
import { selectCpuRegisters } from '@/features/cpu/cpuSlice'

import { type Level, useLevel } from './level'

interface TraceRow {
  step: number
  instruction: string
  gpr: number[]
  ip: number
  sp: number
  sr: number
}

const MAX_ROWS = 200

const flag = (sr: number, mask: number): string => ((sr & mask) === mask ? '1' : '0')

const headings = (level: Level): string[] =>
  level === 'alevel'
    ? ['Step', 'Instruction', 'AL', 'BL', 'CL', 'DL', 'IP', 'SP', 'Z', 'S', 'O']
    : ['Step', 'Instruction', 'AL', 'BL', 'CL', 'DL', 'Zero flag']

const cells = (row: TraceRow, level: Level): string[] => {
  const registers = row.gpr.map(decToHex)
  return level === 'alevel'
    ? [
        String(row.step),
        row.instruction,
        ...registers,
        decToHex(row.ip),
        decToHex(row.sp),
        flag(row.sr, StatusRegisterFlag.Zero),
        flag(row.sr, StatusRegisterFlag.Sign),
        flag(row.sr, StatusRegisterFlag.Overflow),
      ]
    : [String(row.step), row.instruction, ...registers, flag(row.sr, StatusRegisterFlag.Zero)]
}

const TracePanel: FC = () => {
  const level = useLevel()
  const [rows, setRows] = useState<TraceRow[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let rowsSoFar: TraceRow[] = []
    let stepCount = 0
    let previous = store.getState(selectCpuRegisters)
    let lastSource = store.getState(selectAssembledSource)
    let timer: number | undefined

    const flush = (): void => {
      timer ??= window.setTimeout(() => {
        setRows(rowsSoFar)
        timer = undefined
      })
    }

    const unsubscribe = store.subscribe(() => {
      const source = store.getState(selectAssembledSource)
      const registers = store.getState(selectCpuRegisters)
      if (source !== lastSource) {
        lastSource = source
        rowsSoFar = []
        stepCount = 0
        previous = registers
        flush()
        return
      }
      if (registers === previous) {
        return
      }
      const isReset = registers.ip === 0
        && registers.sp === MAX_SP
        && registers.sr === 0
        && registers.gpr.every((value) => value === 0)
      if (isReset) {
        rowsSoFar = []
        stepCount = 0
        previous = registers
        flush()
        return
      }
      if (registers.ip !== previous.ip) {
        const statement = store.getState(selectAddressToStatementMap)[previous.ip]
        const instruction = statement
          ? source.slice(statement.range.from, statement.range.to)
              .replace(/;.*$/gm, '')
              .replace(/^\s*[A-Za-z_]\w*:\s*/, '')
              .replace(/\s+/g, ' ')
              .trim()
          : '?'
        stepCount += 1
        rowsSoFar = [
          ...rowsSoFar.slice(-(MAX_ROWS - 1)),
          {
            step: stepCount,
            instruction,
            gpr: [...registers.gpr],
            ip: registers.ip,
            sp: registers.sp,
            sr: registers.sr,
          },
        ]
        flush()
      }
      previous = registers
    })
    return () => {
      unsubscribe()
      window.clearTimeout(timer)
    }
  }, [])

  const copyTable = (): void => {
    const lines = [headings(level), ...rows.map((row) => cells(row, level))]
    navigator.clipboard
      .writeText(lines.map((line) => line.join('\t')).join('\n'))
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      })
      .catch(console.error)
  }

  return (
    <div className="trace-panel">
      <p className="eyebrow">Trace table</p>
      <p className="muted">
        Each row shows the register values after that instruction ran. Values are in hex.
        Press Step to add rows.
      </p>
      <div className="trace-actions">
        <button type="button" onClick={() => setRows([])}>Clear</button>
        <button disabled={rows.length === 0} type="button" onClick={copyTable}>
          {copied ? 'Copied' : 'Copy table'}
        </button>
      </div>
      {rows.length === 0
        ? <p className="muted">No steps yet.</p>
        : (
            <table className="trace-table">
              <thead>
                <tr>{headings(level).map((heading) => <th key={heading}>{heading}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(-50).map((row) => (
                  <tr key={row.step}>
                    {cells(row, level).map((cell, index) => <td key={index}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
    </div>
  )
}

export default TracePanel
