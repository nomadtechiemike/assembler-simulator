import { type FC, useState } from 'react'

import { useSelector } from '@/app/store'
import { selectEditorInput } from '@/features/editor/editorSlice'
import { examples } from '@/features/editor/examples'

const LearningPanel: FC = () => {
  const input = useSelector(selectEditorInput)
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const activeExample = examples.find((example) => example.content === input)
  const isVduLesson = activeExample?.title === 'Visual Display Unit'

  return (
    <div className="learning-panel">
      <p className="eyebrow">Guided practice</p>
      <h2>{activeExample?.title ?? 'Your program'}</h2>
      {isVduLesson
        ? (
            <>
              <p>Trace how a character moves from the data table into video memory.</p>
              <ol>
                <li>Assemble the program, then find the first <code>MOV CL, [BL]</code>.</li>
                <li>Before stepping, predict the value that CL will receive.</li>
                <li>Step again and watch the changed register and memory address.</li>
              </ol>
              <div className="learning-question">
                <strong>Prediction</strong>
                <p>Where will <code>MOV [AL], CL</code> put the character held in CL?</p>
                <button type="button" onClick={() => setShowHint(!showHint)}>
                  {showHint ? 'Hide hint' : 'Show hint'}
                </button>
                {showHint && <p>Look at the value in AL. It points into video memory.</p>}
                <button type="button" onClick={() => setShowAnswer(!showAnswer)}>
                  {showAnswer ? 'Hide answer' : 'Reveal answer'}
                </button>
                {showAnswer && (
                  <p>It writes the character to the video memory address stored in AL.</p>
                )}
              </div>
            </>
          )
        : (
            <>
              <p>Use the execution controls to trace this program one instruction at a time.</p>
              <ol>
                <li>Predict which register or memory address the next instruction will change.</li>
                <li>Press Step and compare your prediction with Latest changes above.</li>
                <li>Set a breakpoint at a line you want to investigate.</li>
              </ol>
              {!activeExample && <p className="muted">Open an example from the File menu for a starting point.</p>}
            </>
          )}
    </div>
  )
}

export default LearningPanel
