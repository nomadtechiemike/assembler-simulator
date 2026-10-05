import type { FC } from 'react'

import { useSelector } from '@/app/store'
import { selectAssembledSource, selectAssemblerError } from '@/features/assembler/assemblerSlice'
import { selectCpuStatus } from '@/features/cpu/cpuSlice'

import { selectIsRunning, selectIsSuspended } from './controllerSlice'

const ExecutionStatus: FC = () => {
  const running = useSelector(selectIsRunning)
  const suspended = useSelector(selectIsSuspended)
  const { fault, halted } = useSelector(selectCpuStatus)
  const error = useSelector(selectAssemblerError)
  const source = useSelector(selectAssembledSource)

  const status = fault || error
    ? 'Error'
    : suspended
      ? 'Waiting for input'
      : running
        ? 'Running'
        : halted
          ? 'Halted'
          : source
            ? 'Ready to step'
            : 'Ready to assemble'

  return <span className={`execution-status status-${status.split(' ')[0].toLowerCase()}`} role="status">{status}</span>
}

export default ExecutionStatus
