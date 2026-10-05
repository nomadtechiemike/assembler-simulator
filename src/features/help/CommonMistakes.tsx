import type { FC } from 'react'

const errors: [message: string, meaning: string, fix: string][] = [
  [
    "Expected number, address or register address, got 'BL'.",
    'You tried MOV AL, BL. MOV cannot copy one register to another.',
    'Use MOV AL, 00 then ADD AL, BL, or go through memory.',
  ],
  [
    'Expected END at the end of the source code.',
    'The program has no END line.',
    'Put END on its own line after your last instruction.',
  ],
  [
    "Label 'Nowhere' does not exist.",
    'A jump uses a label that is not defined, or is spelt differently.',
    'Check the spelling. The label must end with a colon where it is defined, such as Loop:',
  ],
  [
    "Expected label or instruction, got 'Loop'.",
    'A label is missing its colon, or an instruction name is misspelt.',
    'Write Loop: with a colon. Check the instruction against the Instruction set page.',
  ],
  [
    "Expected register, address or register address, got 'XL'.",
    'That register does not exist.',
    'The registers are AL, BL, CL and DL.',
  ],
  [
    "Number '100' is greater than FF.",
    'Numbers are 8-bit hex, from 00 to FF.',
    'Use a smaller number. 100 in hex is 256, which is too big.',
  ],
  [
    "Expected label, got '20'.",
    'Jump instructions need a label, not an address.',
    'Add a label such as Next: and write JMP Next. (CALL does the opposite: it needs an address.)',
  ],
  [
    "Expected comma, got '01'.",
    'The comma between operands is missing.',
    'Write MOV AL, 01.',
  ],
  [
    "Expected register, got '01'.",
    'You tried to store a number straight into memory, such as MOV [BL], 01.',
    'Load the number into a register first, then store the register.',
  ],
  [
    "Duplicate label 'A'.",
    'Two lines use the same label.',
    'Give each label its own name.',
  ],
]

const CommonMistakes: FC = () => (
  <div className="help-prose">
    <p className="help-lead">
      What an error message means, and how to fix it.
    </p>
    <div className="help-table-wrap">
      <table className="help-table">
        <thead>
          <tr><th>Message</th><th>What it means</th><th>How to fix it</th></tr>
        </thead>
        <tbody>
          {errors.map(([message, meaning, fix]) => (
            <tr key={message}>
              <td><code>{message}</code></td>
              <td>{meaning}</td>
              <td>{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <section className="help-callout">
      <h3>The program assembles but does not do what you expect</h3>
      <ul className="help-list">
        <li><strong>Numbers are hex.</strong> <code>MOV AL, 10</code> puts 16 into AL, with no error. Hex 0A is ten.</li>
        <li><strong>No output?</strong> Open the <strong>I/O</strong> tab. The display and lights are there.</li>
        <li><strong>Too fast to see?</strong> Lower <strong>Configuration → Clock Speed</strong>, or use <strong>Step</strong>.</li>
        <li><strong>Stuck in a loop?</strong> Press <strong>Stop</strong>, then <strong>Reset</strong>. Check what changes the register your loop tests.</li>
        <li><strong>Wrong answer after a jump?</strong> Remember <code>CMP</code> sets the flags, and the next jump reads them. Anything in between can change them.</li>
      </ul>
    </section>
  </div>
)

export default CommonMistakes
