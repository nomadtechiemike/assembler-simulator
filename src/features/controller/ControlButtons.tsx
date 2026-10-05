import type { FC, PropsWithChildren } from 'react'

import { useSelector } from '@/app/store'
import { Arrow, Forward, Play, Stop, Undo } from '@/common/components/icons'
import { NO_BREAK_SPACE } from '@/common/constants'

import { selectIsRunning, selectIsSuspended } from './controllerSlice'
import { useController } from './hooks'

type ButtonProps = PropsWithChildren<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}>

const ControlButton: FC<ButtonProps> = ({ onClick, disabled = false, children }) => (
  <button
    className="control-button"
    disabled={disabled}
    type="button"
    onClick={onClick}>
    {children}
  </button>
)

// TODO: useMemo
const ControlButtons: FC = () => {
  const controller = useController()

  const AssembleButton = () => (
    <ControlButton onClick={controller.assemble}>
      <Arrow />
      <span>Assemble</span>
    </ControlButton>
  )

  const RunButton = () => {
    const isRunning = useSelector(selectIsRunning)
    const isSuspended = useSelector(selectIsSuspended)
    return (
      <ControlButton disabled={isSuspended} onClick={controller.runOrStop}>
        {isRunning
          ? (
              <>
                <Stop />
                <span>Stop</span>
              </>
            )
          : (
              <>
                <Play />
                <span>
                  Run
                  {NO_BREAK_SPACE}
                </span>
              </>
            )}
      </ControlButton>
    )
  }

  const StepButton = () => {
    const isRunning = useSelector(selectIsRunning)
    const isSuspended = useSelector(selectIsSuspended)
    return (
      <ControlButton
        disabled={isRunning || isSuspended}
        onClick={controller.step.bind(null, { isUserAction: true })}>
        <Forward />
        <span>Step</span>
      </ControlButton>
    )
  }

  const ResetButton = () => (
    <ControlButton onClick={controller.reset}>
      <Undo />
      <span>Reset</span>
    </ControlButton>
  )

  return (
    <>
      <AssembleButton />
      <RunButton />
      <StepButton />
      <ResetButton />
    </>
  )
}

export default ControlButtons
