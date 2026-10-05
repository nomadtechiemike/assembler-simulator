import type { FC } from 'react'

const MemoryAndIo: FC = () => (
  <div className="help-prose">
    <p className="help-lead">The simulator has 256 byte-addressed memory locations, numbered <code>00</code> to <code>FF</code>.</p>
    <section className="help-card-grid">
      <div className="help-card">
        <span className="eyebrow">Memory</span>
        <h3>Program and data</h3>
        <p>Assembly starts at address <code>00</code>. Instructions and <code>DB</code> data share the same memory. Use <code>JMP Start</code> to skip over a data table at the beginning of a program.</p>
      </div>
      <div className="help-card">
        <span className="eyebrow">Memory mapped output</span>
        <h3>Visual Display Unit</h3>
        <p>Addresses <code>C0</code> to <code>FF</code> are video RAM. Writing a character byte there updates the text display. For example, <code>MOV [C0], AL</code> writes AL to its first position.</p>
      </div>
    </section>
    <section>
      <h3>Input and output ports</h3>
      <div className="help-instruction-list">
        <div className="help-instruction-row"><code>IN 00</code><span>Wait for a key in the simulated keyboard, then place its character code in AL. Enter gives <code>0D</code>.</span></div>
        <div className="help-instruction-row"><code>OUT 01</code><span>Send the bits in AL to the traffic lights.</span></div>
        <div className="help-instruction-row"><code>OUT 02</code><span>Send the bits in AL to the seven-segment display.</span></div>
      </div>
      <p>Open the <strong>I/O</strong> tab to see output devices. The <strong>View → I/O Devices</strong> menu controls which device cards are shown.</p>
    </section>
    <section className="help-callout">
      <h3>Try writing one character</h3>
      <pre><code>{'MOV AL, 41\nMOV [C0], AL\nEND'}</code></pre>
      <p><code>41</code> is the hexadecimal ASCII code for “A”. Assemble and step through the program; the first VDU cell should show A.</p>
    </section>
    <section>
      <h3>Memory and flags while tracing</h3>
      <p>The <strong>Memory</strong> tab shows bytes and source at their addresses. The <strong>CPU</strong> tab shows IP, SP, and SR alongside the general-purpose registers. After a <code>CMP</code>, try stepping over <code>JZ</code> or <code>JNZ</code> and watch whether IP jumps to the label.</p>
    </section>
  </div>
)

export default MemoryAndIo
