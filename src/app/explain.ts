export interface Explanation {
  /** Plain-English description of what the instruction does */
  english: string
  /** Register transfer notation, shown at A Level */
  rtn?: string
  /** Closest Cambridge 9618 instruction, shown at A Level */
  cambridge?: string
}

const REGISTER = /^[ABCD]L$/i
const MEMORY = /^\[(.+)\]$/

const ioPorts: Record<string, string> = {
  '00': 'the keyboard',
  '01': 'the traffic lights',
  '02': 'the seven-segment display',
}

const hex = (value: string): string => `hex ${value.toUpperCase()}`

const describeSource = (operand: string): string => {
  const memory = MEMORY.exec(operand)
  if (memory) {
    const inner = memory[1].trim()
    return REGISTER.test(inner)
      ? `the memory location whose address is held in ${inner.toUpperCase()}`
      : `memory address ${inner.toUpperCase()}`
  }
  return REGISTER.test(operand) ? operand.toUpperCase() : hex(operand)
}

const rtnSource = (operand: string): string => {
  const memory = MEMORY.exec(operand)
  if (memory) {
    return `[${memory[1].trim().toUpperCase()}]`
  }
  return operand.toUpperCase()
}

const arithmetic: Record<string, [verb: string, symbol: string, cambridge: string]> = {
  ADD: ['Add', '+', 'ADD'],
  SUB: ['Subtract', '-', 'SUB'],
  MUL: ['Multiply', '×', ''],
  DIV: ['Divide', '÷', ''],
  MOD: ['Take the remainder of dividing', 'MOD', ''],
}

const logic: Record<string, [text: string, cambridge: string]> = {
  AND: ['Each result bit is 1 only if both bits are 1 (used to mask bits off).', 'AND'],
  OR: ['Each result bit is 1 if either bit is 1 (used to switch bits on).', 'OR'],
  XOR: ['Each result bit is 1 if the bits are different (used to flip bits).', 'XOR'],
}

const jumps: Record<string, [text: string, cambridge: string]> = {
  JMP: ['Jump', 'JMP'],
  JZ: ['Jump if the Zero flag is set (the last result was zero, or the values were equal)', 'JPE'],
  JNZ: ['Jump if the Zero flag is not set (the last result was not zero, or the values differed)', 'JPN'],
  JS: ['Jump if the Sign flag is set (the last result was negative)', ''],
  JNS: ['Jump if the Sign flag is not set (the last result was zero or positive)', ''],
  JO: ['Jump if the Overflow flag is set (the result did not fit in 8 bits)', ''],
  JNO: ['Jump if the Overflow flag is not set', ''],
}

const splitOperands = (rest: string): string[] =>
  rest.length === 0 ? [] : rest.split(',').map((part) => part.trim())

export const explainInstruction = (statement: string): Explanation | null => {
  const text = statement
    .replace(/;.*$/gm, '')
    .replace(/^\s*[A-Za-z_]\w*:\s*/, '')
    .trim()
  const match = /^([A-Za-z]+)\s*(.*)$/s.exec(text)
  if (!match) {
    return null
  }
  const mnemonic = match[1].toUpperCase()
  const operands = splitOperands(match[2])
  const [first = '', second = ''] = operands
  const dest = first.toUpperCase()

  if (mnemonic === 'MOV' && operands.length === 2) {
    const destMemory = MEMORY.exec(first)
    if (destMemory) {
      const inner = destMemory[1].trim()
      const where = REGISTER.test(inner)
        ? `the memory location whose address is held in ${inner.toUpperCase()}`
        : `memory address ${inner.toUpperCase()}`
      return {
        english: `Store the value in ${second.toUpperCase()} into ${where}.`,
        rtn: `[${inner.toUpperCase()}] ← ${second.toUpperCase()}`,
        cambridge: REGISTER.test(inner) ? undefined : `STO ${inner.toUpperCase()}`,
      }
    }
    const sourceMemory = MEMORY.exec(second)
    if (sourceMemory) {
      const inner = sourceMemory[1].trim()
      return {
        english: `Copy the value from ${describeSource(second)} into ${dest}.`,
        rtn: `${dest} ← [${inner.toUpperCase()}]`,
        cambridge: REGISTER.test(inner) ? 'LDI' : `LDD ${inner.toUpperCase()}`,
      }
    }
    return {
      english: `Put the value ${hex(second)} into ${dest}.`,
      rtn: `${dest} ← ${second.toUpperCase()}`,
      cambridge: `LDM #${second.toUpperCase()}`,
    }
  }

  if (mnemonic in arithmetic && operands.length === 2) {
    const [verb, symbol, cambridge] = arithmetic[mnemonic]
    const source = describeSource(second)
    const english = mnemonic === 'SUB'
      ? `Subtract ${source} from ${dest}. The answer is stored in ${dest}.`
      : mnemonic === 'ADD'
        ? `Add ${source} to ${dest}. The answer is stored in ${dest}.`
        : `${verb} ${dest} ${mnemonic === 'MOD' ? 'by' : 'by'} ${source}. The answer is stored in ${dest}.`
    return {
      english,
      rtn: `${dest} ← ${dest} ${symbol} ${rtnSource(second)}`,
      cambridge: cambridge || undefined,
    }
  }

  if (mnemonic === 'INC' || mnemonic === 'DEC') {
    return {
      english: `${mnemonic === 'INC' ? 'Add' : 'Subtract'} 1 ${mnemonic === 'INC' ? 'to' : 'from'} ${dest}.`,
      rtn: `${dest} ← ${dest} ${mnemonic === 'INC' ? '+' : '-'} 1`,
      cambridge: `${mnemonic} ${dest}`,
    }
  }

  if (mnemonic in logic && operands.length === 2) {
    const [text, cambridge] = logic[mnemonic]
    return {
      english: `Bitwise ${mnemonic} of ${dest} with ${describeSource(second)}. ${text}`,
      rtn: `${dest} ← ${dest} ${mnemonic} ${rtnSource(second)}`,
      cambridge,
    }
  }

  switch (mnemonic) {
  case 'NOT':
    return {
      english: `Flip every bit in ${dest} (0 becomes 1 and 1 becomes 0).`,
      rtn: `${dest} ← NOT ${dest}`,
    }
  case 'SHL':
    return {
      english: `Shift every bit in ${dest} one place left. This multiplies by 2.`,
      rtn: `${dest} ← ${dest} << 1`,
      cambridge: 'LSL #1',
    }
  case 'SHR':
    return {
      english: `Shift every bit in ${dest} one place right. This divides by 2.`,
      rtn: `${dest} ← ${dest} >> 1`,
      cambridge: 'LSR #1',
    }
  case 'ROL':
    return {
      english: `Rotate the bits in ${dest} one place left. The left-most bit wraps round to the right.`,
      rtn: `${dest} ← ROL(${dest})`,
    }
  case 'ROR':
    return {
      english: `Rotate the bits in ${dest} one place right. The right-most bit wraps round to the left.`,
      rtn: `${dest} ← ROR(${dest})`,
    }
  case 'CMP':
    return {
      english: `Compare ${dest} with ${describeSource(second)} by subtracting. The answer is thrown away, but the flags (Zero, Sign, Overflow) are set.`,
      rtn: `${dest} - ${rtnSource(second)} → flags`,
      cambridge: 'CMP',
    }
  case 'JMP': case 'JZ': case 'JNZ': case 'JS': case 'JNS': case 'JO': case 'JNO': {
    const [verb, cambridge] = jumps[mnemonic]
    return {
      english: mnemonic === 'JMP'
        ? `Jump to the label ${first}. The next instruction is taken from there.`
        : `${verb}, to the label ${first}. Otherwise carry on with the next line.`,
      rtn: mnemonic === 'JMP' ? `IP ← ${first}` : `IF condition THEN IP ← ${first}`,
      cambridge: cambridge ? `${cambridge} ${first}` : undefined,
    }
  }
  case 'CALL':
    return {
      english: `Call the procedure at address ${first.toUpperCase()}. The return address is saved on the stack.`,
      rtn: `PUSH IP; IP ← ${first.toUpperCase()}`,
    }
  case 'RET':
    return {
      english: 'Return from the procedure. The saved return address is taken off the stack.',
      rtn: 'IP ← POP',
    }
  case 'PUSH':
    return {
      english: `Put the value in ${dest} on top of the stack.`,
      rtn: `SP ← SP - 1; [SP] ← ${dest}`,
    }
  case 'POP':
    return {
      english: `Take the top value off the stack and put it in ${dest}.`,
      rtn: `${dest} ← [SP]; SP ← SP + 1`,
    }
  case 'PUSHF':
    return { english: 'Save the flags on the stack.' }
  case 'POPF':
    return { english: 'Restore the flags from the stack.' }
  case 'IN':
    return {
      english: `Read a value from ${ioPorts[first.toUpperCase().padStart(2, '0')] ?? `input port ${first.toUpperCase()}`} into AL.`,
      rtn: `AL ← port ${first.toUpperCase()}`,
      cambridge: 'IN',
    }
  case 'OUT':
    return {
      english: `Send the value in AL to ${ioPorts[first.toUpperCase().padStart(2, '0')] ?? `output port ${first.toUpperCase()}`}.`,
      rtn: `port ${first.toUpperCase()} ← AL`,
      cambridge: 'OUT',
    }
  case 'INT':
    return {
      english: `Trigger software interrupt ${first.toUpperCase()}. The CPU saves its place and runs the interrupt routine.`,
    }
  case 'IRET':
    return { english: 'Return from the interrupt routine and carry on where the program left off.' }
  case 'HALT':
    return { english: 'Stop the CPU. The program has finished.', cambridge: 'END' }
  case 'NOP':
    return { english: 'Do nothing for one cycle.' }
  case 'STI':
    return { english: 'Enable interrupts.' }
  case 'CLI':
    return { english: 'Disable interrupts.' }
  case 'CLO':
    return { english: 'Close all open I/O device windows.' }
  default:
    return null
  }
}
