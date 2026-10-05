import type { FC } from 'react'

const UsingInClass: FC = () => (
  <div className="help-prose">
    <p className="help-lead">
      Tools for following a program one step at a time, at the level you are studying.
    </p>
    <div className="help-card-grid">
      <section className="help-card">
        <span className="eyebrow">Top bar</span>
        <h3>Level</h3>
        <p>
          Choose <strong>IGCSE (Y10-11)</strong> or <strong>AS/A Level (Y12-13)</strong>.
          A Level adds register transfer notation, the closest Cambridge 9618 instruction,
          and more columns in the trace table. Your choice is remembered on this device.
        </p>
      </section>
      <section className="help-card">
        <span className="eyebrow">Right-hand panel</span>
        <h3>Next instruction</h3>
        <p>
          The box at the top says in plain English what the highlighted line will do.
          Read it, <em>predict</em> the result, then press <strong>Step</strong> to check.
        </p>
      </section>
      <section className="help-card">
        <span className="eyebrow">Trace tab</span>
        <h3>Trace table</h3>
        <p>
          Each Step adds a row with the registers after that instruction, in hex.
          Use <strong>Copy table</strong> to paste it into a document, or <strong>Clear</strong> to start again.
        </p>
      </section>
      <section className="help-card">
        <span className="eyebrow">File menu</span>
        <h3>Open Example</h3>
        <p>
          Ready-made programs with comments on every line. Use <strong>Configuration → Clock Speed</strong>
          to slow a program down so you can watch it.
        </p>
      </section>
    </div>
    <section className="help-callout">
      <h3>A good routine for any example</h3>
      <ol>
        <li>Open the example and read the comments.</li>
        <li>Press <strong>Step</strong> once. Before each next step, say what will change.</li>
        <li>Check the registers (CPU tab) or the output (I/O tab).</li>
        <li>Fill in the Trace tab, then change one value in the code and run it again.</li>
      </ol>
    </section>
    <section>
      <h3>Suggested examples by level</h3>
      <dl className="help-definition-list">
        <div>
          <dt>IGCSE</dt>
          <dd>Add Two Numbers · Multiply by Repeated Addition · Find the Largest Number · Binary Counter · Traffic Light Sequence · Visual Display Unit</dd>
        </div>
        <div>
          <dt>AS/A Level</dt>
          <dd>Overflow · Shifts · Bit Masking · Reverse a String Using the Stack · Procedures · Software and Hardware Interrupts · Keyboard Input</dd>
        </div>
      </dl>
    </section>
  </div>
)

export default UsingInClass
