import { type FC, useMemo } from 'react'

import { useSelector } from '@/app/store'
import { decToHex } from '@/common/utils'
import { selectAddressToStatementMap, selectAssembledSource } from '@/features/assembler/assemblerSlice'
import { selectCpuInstructionPointerRegister } from '@/features/cpu/cpuSlice'

import { useLevel } from './level'

interface Row {
  address: number
  codes: number[]
  label: string
  text: string
}

const LABEL = /^\s*([A-Za-z_]\w*):\s*/

const ListingPanel: FC = () => {
  const level = useLevel()
  const map = useSelector(selectAddressToStatementMap)
  const source = useSelector(selectAssembledSource)
  const ip = useSelector(selectCpuInstructionPointerRegister)

  const rows = useMemo<Row[]>(
    () =>
      Object.keys(map)
        .map(Number)
        .sort((a, b) => a - b)
        .flatMap((address) => {
          const statement = map[address]
          if (!statement || statement.codes.length === 0) {
            return []
          }
          const raw = source
            .slice(statement.range.from, statement.range.to)
            .replace(/;.*$/gm, '')
          const label = LABEL.exec(raw)?.[1] ?? ''
          const text = raw.replace(LABEL, '').replace(/\s+/g, ' ').trim()
          return [{ address, codes: statement.codes, label, text }]
        }),
    [map, source],
  )

  if (rows.length === 0) {
    return (
      <div className="trace-panel">
        <p className="eyebrow">Assembly and machine code</p>
        <p className="muted">Assemble a program to see its machine code here.</p>
      </div>
    )
  }

  const labels = rows.filter(({ label }) => label !== '')

  return (
    <div className="trace-panel">
      <p className="eyebrow">Assembly and machine code</p>
      <p className="muted">
        The assembler turns each line into bytes: an opcode, which says what to do, then any operands.
        All values are hex.
      </p>
      <table className="trace-table listing-table">
        <thead>
          <tr><th>Address</th><th>Machine code</th><th>Assembly</th></tr>
        </thead>
        <tbody>
          {rows.map(({ address, codes, label, text }) => (
            <tr key={address} className={address === ip ? 'listing-current' : undefined}>
              <td>{decToHex(address)}</td>
              <td>{codes.map(decToHex).join(' ')}</td>
              <td>{label && <span className="listing-label">{label}: </span>}{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {level === 'alevel' && labels.length > 0 && (
        <>
          <p className="eyebrow listing-heading">Pass 1: symbol table</p>
          <p className="muted">
            On the first pass the assembler records the address of every label. On the second pass it
            swaps each label in a jump for its address.
          </p>
          <table className="trace-table">
            <thead>
              <tr><th>Label</th><th>Address</th></tr>
            </thead>
            <tbody>
              {labels.map(({ label, address }) => (
                <tr key={label}><td>{label}</td><td>{decToHex(address)}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default ListingPanel
