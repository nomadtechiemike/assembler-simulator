import type { FC } from 'react'

const rows: [cambridge: string, simulator: string, note: string][] = [
  ['LDM #5', 'MOV AL, 05', 'Load a number. In this simulator, numbers are written in hex.'],
  ['LDD 100', 'MOV AL, [64]', 'Load from an address. Denary 100 is 64 in hex.'],
  ['LDI 100', 'MOV AL, [BL]', 'Indirect: the address is held in a register, here BL.'],
  ['STO 100', 'MOV [64], AL', 'Store the accumulator to an address.'],
  ['ADD #3', 'ADD AL, 03', 'Add a number.'],
  ['ADD 100', 'MOV BL, [64]  then  ADD AL, BL', 'ADD cannot read memory directly, so load the value into a register first.'],
  ['SUB #3', 'SUB AL, 03', 'Subtract a number.'],
  ['INC ACC / DEC ACC', 'INC AL / DEC AL', 'Add or subtract one.'],
  ['CMP #5', 'CMP AL, 05', 'Compare. Also available: CMP AL, [64].'],
  ['JPE label', 'JZ label', 'Jump if equal. The simulator uses the Zero flag.'],
  ['JPN label', 'JNZ label', 'Jump if not equal.'],
  ['JMP label', 'JMP label', 'Jump always.'],
  ['AND #n / OR #n / XOR #n', 'AND AL, n / OR AL, n / XOR AL, n', 'Bitwise operations.'],
  ['LSL #n', 'SHL AL', 'Shifts one place. Repeat n times for LSL #n.'],
  ['LSR #n', 'SHR AL', 'Shift right, one place at a time.'],
  ['IN / OUT', 'IN 00 / OUT 01', 'The simulator names the port: 00 keyboard, 01 traffic lights, 02 seven-segment display.'],
  ['END', 'HALT', 'HALT stops the CPU. The END line in the source only marks the end of the code.'],
]

const CambridgeTranslation: FC = () => (
  <div className="help-prose">
    <p className="help-lead">
      The Cambridge 9618 exam uses a different assembly language. The ideas are the same,
      so here is the closest simulator instruction for each.
    </p>
    <div className="help-callout">
      <h3>Main differences</h3>
      <p>
        9618 has one accumulator (<code>ACC</code>) and one index register (<code>IX</code>).
        This simulator has four registers: <code>AL</code>, <code>BL</code>, <code>CL</code>, <code>DL</code>.
        Treat <code>AL</code> as the accumulator and <code>BL</code> as an index register.
      </p>
      <p>
        9618 writes numbers in denary by default (<code>#5</code>), with <code>&amp;</code> for hex and <code>B</code> for binary.
        This simulator always uses hex, so <code>MOV AL, 10</code> puts 16 into AL, not 10.
      </p>
      <p>
        9618 <code>CMP</code> sets a true or false result for <code>JPE</code> and <code>JPN</code>.
        This simulator sets flags (Zero, Sign, Overflow) that jumps test.
      </p>
    </div>
    <div className="help-table-wrap">
      <table className="help-table">
        <thead>
          <tr><th>Cambridge 9618</th><th>This simulator</th><th>Note</th></tr>
        </thead>
        <tbody>
          {rows.map(([cambridge, simulator, note]) => (
            <tr key={cambridge}>
              <td><code>{cambridge}</code></td>
              <td><code>{simulator}</code></td>
              <td>{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <section>
      <h3>Here but not in 9618</h3>
      <p>
        <code>MUL</code> <code>DIV</code> <code>MOD</code> <code>NOT</code> <code>ROL</code> <code>ROR</code>{' '}
        <code>PUSH</code> <code>POP</code> <code>CALL</code> <code>RET</code> <code>INT</code> <code>IRET</code>.
        They are useful for understanding computers, but do not use them in 9618 exam answers.
      </p>
    </section>
  </div>
)

export default CambridgeTranslation
