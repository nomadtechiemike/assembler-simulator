import type { FC } from 'react'

const GettingStarted: FC = () => (
  <div className="help-prose">
    <p className="help-lead">
      Write a small program, assemble it, then step through it while watching the CPU and output.
    </p>
    <div className="help-card-grid">
      <section className="help-card">
        <span className="eyebrow">01 · Prepare</span>
        <h3>Choose a program</h3>
        <p>Use <strong>File → Open Example</strong> to load a working program, or type into the editor. Try <strong>Visual Display Unit</strong> first.</p>
      </section>
      <section className="help-card">
        <span className="eyebrow">02 · Build</span>
        <h3>Assemble</h3>
        <p>Click <strong>Assemble</strong> to turn the source into memory bytes. Fix any error shown under the editor before running.</p>
      </section>
      <section className="help-card">
        <span className="eyebrow">03 · Observe</span>
        <h3>Step or run</h3>
        <p><strong>Step</strong> executes one instruction. <strong>Run</strong> continues automatically. The current line, next instruction, and recent changes help you trace the result.</p>
      </section>
      <section className="help-card">
        <span className="eyebrow">04 · Explore</span>
        <h3>Inspect state</h3>
        <p>Switch between <strong>CPU</strong>, <strong>Memory</strong>, <strong>I/O</strong>, and <strong>Learn</strong>. Click <strong>Reset</strong> when you want to start again.</p>
      </section>
    </div>
    <section className="help-callout">
      <h3>Try a two-instruction trace</h3>
      <pre><code>{'MOV AL, 01\nINC AL\nEND'}</code></pre>
      <p>Assemble, then step twice. AL changes from <code>00</code> to <code>01</code> and then <code>02</code>. Values in the editor and register panel are hexadecimal.</p>
    </section>
    <section>
      <h3>Reading the workspace</h3>
      <dl className="help-definition-list">
        <div><dt>AL, BL, CL, DL</dt><dd>Four 8-bit general-purpose registers.</dd></div>
        <div><dt>IP</dt><dd>The memory address of the next instruction.</dd></div>
        <div><dt>SP</dt><dd>The stack pointer, used by stack and procedure instructions.</dd></div>
        <div><dt>SR</dt><dd>Status flags used by conditional jumps and interrupts.</dd></div>
      </dl>
    </section>
  </div>
)

export default GettingStarted
