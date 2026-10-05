import type { FC } from 'react'

import { useSelector } from '@/app/store'
import { decToHex } from '@/common/utils'
import { selectAddressToStatementMap, selectAssembledSource } from '@/features/assembler/assemblerSlice'
import { selectCpuRegisters } from '@/features/cpu/cpuSlice'
import { selectMemoryData } from '@/features/memory/memorySlice'

import { explainInstruction } from './explain'
import { useLevel } from './level'

const hexList = (codes: number[]): string => codes.map(decToHex).join(' ')

const CyclePanel: FC = () => {
  const level = useLevel()
  const registers = useSelector(selectCpuRegisters)
  const memory = useSelector(selectMemoryData)
  const map = useSelector(selectAddressToStatementMap)
  const source = useSelector(selectAssembledSource)

  const ip = registers.ip
  const statement = map[ip]
  const isReady = Boolean(
    statement
    && statement.codes.length
    && statement.codes.every((code, offset) => code === memory[ip + offset]),
  )

  if (!statement || !isReady) {
    return (
      <div className="cycle-panel">
        <p className="eyebrow">Fetch-decode-execute</p>
        <p className="muted">
          Assemble a program and press Step. This tab shows how the CPU fetches, decodes and
          executes the next instruction.
        </p>
      </div>
    )
  }

  const text = source
    .slice(statement.range.from, statement.range.to)
    .replace(/;.*$/gm, '')
    .replace(/^\s*[A-Za-z_]\w*:\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
  const explanation = explainInstruction(text)
  const [opcode, ...operands] = statement.codes
  const length = statement.codes.length
  const mnemonic = text.split(' ')[0].toUpperCase()
  const isAdvanced = level === 'alevel'

  return (
    <div className="cycle-panel">
      <p className="eyebrow">Fetch-decode-execute</p>
      <p className="cycle-instruction">
        <code>{text}</code>
        <span className="muted"> at address {decToHex(ip)}, machine code {hexList(statement.codes)}</span>
      </p>

      <div aria-label="Registers" className="cycle-registers">
        <div><span>PC</span><strong>{decToHex(ip)}</strong></div>
        <div><span>MAR</span><strong>{decToHex(ip)}</strong></div>
        <div><span>MDR</span><strong>{decToHex(opcode)}</strong></div>
        <div><span>CIR</span><strong>{decToHex(opcode)}</strong></div>
        <div><span>ACC (AL)</span><strong>{decToHex(registers.gpr[0])}</strong></div>
      </div>

      <section className="cycle-stage">
        <h3><span>1</span> Fetch</h3>
        {isAdvanced
          ? (
              <ol className="cycle-rtn">
                <li><code>MAR ← [PC]</code> <em>= {decToHex(ip)}</em></li>
                <li>
                  <code>PC ← [PC] + {length}</code>{' '}
                  <em>= {decToHex(ip + length)}</em>
                  {length > 1 && <span className="muted"> (this instruction is {length} bytes long)</span>}
                </li>
                <li><code>MDR ← [[MAR]]</code> <em>= {hexList(statement.codes)}</em></li>
                <li><code>CIR ← [MDR]</code></li>
              </ol>
            )
          : (
              <ol>
                <li>The address in the <strong>PC</strong> ({decToHex(ip)}) is copied to the <strong>MAR</strong>.</li>
                <li>The PC moves on to {decToHex(ip + length)}, the next instruction.</li>
                <li>The instruction at that address ({hexList(statement.codes)}) is copied into the <strong>MDR</strong>.</li>
                <li>It is then copied from the MDR into the <strong>CIR</strong>.</li>
              </ol>
            )}
      </section>

      <section className="cycle-stage">
        <h3><span>2</span> Decode</h3>
        <p>
          The control unit reads the CIR. The opcode <code>{decToHex(opcode)}</code> means <code>{mnemonic}</code>
          {operands.length > 0
            ? <>, and the operand{operands.length > 1 ? 's are' : ' is'} <code>{hexList(operands)}</code>.</>
            : ', which has no operand.'}
        </p>
      </section>

      <section className="cycle-stage">
        <h3><span>3</span> Execute</h3>
        {explanation
          ? (
              <>
                <p>{explanation.english}</p>
                {isAdvanced && explanation.rtn && <p><code>{explanation.rtn}</code></p>}
              </>
            )
          : <p>The CPU carries out the instruction.</p>}
        <p className="muted">
          Then the CPU checks for an interrupt and the cycle starts again from the new PC.
        </p>
      </section>
    </div>
  )
}

export default CyclePanel
