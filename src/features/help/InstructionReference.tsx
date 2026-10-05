import { type FC, useState } from 'react'

interface Instruction {
  syntax: string
  description: string
}

interface Group {
  title: string
  instructions: Instruction[]
}

// Kept in sync with the assembler's supported mnemonics and operand patterns.
const groups: Group[] = [
  {
    title: 'Data movement',
    instructions: [
      { syntax: 'MOV AL, 2A', description: 'Put an 8-bit value in a register.' },
      { syntax: 'MOV AL, [20]', description: 'Read a byte from a fixed memory address.' },
      { syntax: 'MOV [20], AL', description: 'Write a register to a fixed memory address.' },
      { syntax: 'MOV AL, [BL]', description: 'Read from the address held in a register.' },
      { syntax: 'MOV [BL], AL', description: 'Write to the address held in a register.' },
    ],
  },
  {
    title: 'Arithmetic',
    instructions: [
      { syntax: 'ADD AL, BL / 01', description: 'Add a register or value to the destination.' },
      { syntax: 'SUB AL, BL / 01', description: 'Subtract from the destination.' },
      { syntax: 'MUL AL, BL / 02', description: 'Multiply the destination.' },
      { syntax: 'DIV AL, BL / 02', description: 'Divide the destination; keep the integer quotient.' },
      { syntax: 'MOD AL, BL / 02', description: 'Keep the remainder after division.' },
      { syntax: 'INC AL', description: 'Increase the register by one.' },
      { syntax: 'DEC AL', description: 'Decrease the register by one.' },
    ],
  },
  {
    title: 'Logic and bits',
    instructions: [
      { syntax: 'AND AL, BL / 0F', description: 'Bitwise AND.' },
      { syntax: 'OR AL, BL / 0F', description: 'Bitwise OR.' },
      { syntax: 'XOR AL, BL / 0F', description: 'Bitwise exclusive OR.' },
      { syntax: 'NOT AL', description: 'Invert all bits.' },
      { syntax: 'ROL AL / ROR AL', description: 'Rotate bits left or right.' },
      { syntax: 'SHL AL / SHR AL', description: 'Shift bits left or right.' },
    ],
  },
  {
    title: 'Compare and branch',
    instructions: [
      { syntax: 'CMP AL, BL / 00 / [20]', description: 'Compare without changing AL; update status flags.' },
      { syntax: 'JMP Loop', description: 'Always jump to a label.' },
      { syntax: 'JZ Loop / JNZ Loop', description: 'Jump if the zero flag is set / clear.' },
      { syntax: 'JS Loop / JNS Loop', description: 'Jump if the sign flag is set / clear.' },
      { syntax: 'JO Loop / JNO Loop', description: 'Jump if the overflow flag is set / clear.' },
    ],
  },
  {
    title: 'Stack and procedures',
    instructions: [
      { syntax: 'PUSH AL / POP AL', description: 'Push a register onto the stack / pop into a register.' },
      { syntax: 'PUSHF / POPF', description: 'Push / pop the status register.' },
      { syntax: 'CALL 30 / RET', description: 'Call a procedure at a numeric address / return.' },
    ],
  },
  {
    title: 'Interrupts and I/O',
    instructions: [
      { syntax: 'INT 02 / IRET', description: 'Start a software interrupt / return from it.' },
      { syntax: 'IN 00', description: 'Read from an input port into AL.' },
      { syntax: 'OUT 01', description: 'Send AL to an output port.' },
      { syntax: 'STI / CLI', description: 'Enable / disable hardware interrupts.' },
    ],
  },
  {
    title: 'Control',
    instructions: [
      { syntax: 'NOP', description: 'Do nothing for one instruction.' },
      { syntax: 'HALT', description: 'Stop execution.' },
      { syntax: 'CLO', description: 'Close output windows.' },
    ],
  },
]

const InstructionReference: FC = () => {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = groups
    .map((group) => ({
      ...group,
      instructions: group.instructions.filter(({ syntax, description }) =>
        (syntax + ' ' + description).toLowerCase().includes(normalizedQuery)),
    }))
    .filter(({ instructions }) => instructions.length > 0)

  return (
    <div className="help-prose">
      <p className="help-lead">A quick reference for the instructions this simulator accepts. Examples use hexadecimal values.</p>
      <div className="help-callout">
        <h3>How to read the examples</h3>
        <p><code>AL</code>, <code>BL</code>, <code>CL</code>, and <code>DL</code> are registers. <code>[20]</code> means the byte at address 20; <code>[BL]</code> uses the address stored in BL. A slash shows alternative forms, not text to type into the editor.</p>
        <p>Numbers are hexadecimal from <code>00</code> to <code>FF</code>. A semicolon starts a comment. Jumps use labels such as <code>Loop:</code>; <code>CALL</code> uses a numeric address.</p>
      </div>
      <label className="help-search">
        <span>Find an instruction</span>
        <input
          placeholder="Try MOV, jump, stack, output…"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {filtered.length === 0 && <p role="status">No matching instructions. Try another word.</p>}
      {filtered.map(({ title, instructions }) => (
        <section key={title} className="help-instruction-group">
          <h3>{title}</h3>
          <div className="help-instruction-list">
            {instructions.map(({ syntax, description }) => (
              <div key={syntax} className="help-instruction-row">
                <code>{syntax}</code>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="help-callout">
        <h3>Assembler directives</h3>
        <p><code>DB 41</code> stores one byte; <code>DB "Hi"</code> stores character bytes. <code>ORG 30</code> moves the assembly location to address 30. <code>END</code> marks the end of source.</p>
      </section>
    </div>
  )
}

export default InstructionReference
