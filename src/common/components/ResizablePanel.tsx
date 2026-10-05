import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { clamp, classNames, range, throttle } from '../utils'

export const DEFAULT_RESIZE_THROTTLE_MS = 10

const DOUBLE_CLICK_DELAY_MS = 500

const MIN_WIDTH_PERCENTAGE = 0.25
const MAX_WIDTH_PERCENTAGE = 0.75

interface ResizablePanelProps {
  children: [leftChild: ReactNode, rightChild: ReactNode]
  throttle?: number
  className?: string
}

const getOffsetWidth = (ref: React.RefObject<HTMLElement | null>) => ref.current!.offsetWidth

const ResizablePanel: FC<ResizablePanelProps> = ({
  children: [leftChild, rightChild],
  throttle: throttleMs = DEFAULT_RESIZE_THROTTLE_MS,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  const getTotalWidth = useCallback(
    () => getOffsetWidth(containerRef) - getOffsetWidth(dividerRef),
    [],
  )

  const [leftChildWidth, __setLeftChildWidth] = useState<number>()
  const isReady = leftChildWidth !== undefined

  const setLeftChildWidth = (width: number): void => {
    const roundedWidth = Math.round(width)
    __setLeftChildWidth(roundedWidth)
  }

  const resetLeftChildWidth = useCallback(() => {
    const totalWidth = getTotalWidth()
    if (totalWidth > 0) {
      setLeftChildWidth(totalWidth / 2)
    }
  }, [getTotalWidth])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const updateWidth = () => {
      const totalWidth = getTotalWidth()
      if (totalWidth <= 0) {
        return
      }
      __setLeftChildWidth((current) => {
        if (current === undefined) {
          return Math.round(totalWidth / 2)
        }
        return Math.round(clamp(current, totalWidth * MIN_WIDTH_PERCENTAGE, totalWidth * MAX_WIDTH_PERCENTAGE))
      })
    }
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [getTotalWidth])

  const [isDragging, setDragging] = useState(false)

  const clickCountRef = useRef(0)
  const clickTimeoutIdRef = useRef<number>(undefined)

  const handleMouseDown = (): void => {
    setDragging(true)

    clickCountRef.current += 1
    if (clickCountRef.current === 2) {
      resetLeftChildWidth()
      window.clearTimeout(clickTimeoutIdRef.current)
      clickCountRef.current = 0
    }
    else {
      clickTimeoutIdRef.current = window.setTimeout(() => {
        clickCountRef.current = 0
      }, DOUBLE_CLICK_DELAY_MS)
    }
  }

  useEffect(() => {
    if (!isDragging) {
      return
    }

    const handleMouseMove = throttle((event: MouseEvent) => {
      const dividerWidth = getOffsetWidth(dividerRef)
      const clientX = event.clientX - dividerWidth / 2

      const totalWidth = getTotalWidth()

      const percentage = clientX / totalWidth
      const percentageAdjusted = clamp(percentage, MIN_WIDTH_PERCENTAGE, MAX_WIDTH_PERCENTAGE)

      const widthAdjusted = percentageAdjusted * totalWidth

      setLeftChildWidth(widthAdjusted)
    }, throttleMs)

    const handleMouseUp = (): void => {
      setDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [getTotalWidth, isDragging, throttleMs])

  return (
    <>
      <div ref={containerRef} className={classNames('flex', className)}>
        <div className={classNames('workspace-editor-pane', { hidden: !isReady })} style={{ width: leftChildWidth }}>
          {leftChild}
        </div>
        <div
          ref={dividerRef}
          className={classNames(
            'workspace-divider border-x cursor-col-resize flex flex-col space-y-2 px-1 justify-center group hover:bg-gray-200',
            isReady ? (isDragging ? 'bg-gray-200' : 'bg-gray-100') : 'invisible',
          )}
          onMouseDown={handleMouseDown}>
          {range(3).map((dotIndex) => (
            <span
              key={dotIndex}
              className={classNames(
                'rounded-full h-1 w-1 group-hover:bg-slate-400',
                isDragging ? 'bg-slate-400' : 'bg-slate-300',
              )}
            />
          ))}
        </div>
        <div className={classNames('workspace-state-pane flex-1', { hidden: !isReady })}>
          {rightChild}
        </div>
      </div>
      {isDragging && <div className="cursor-col-resize inset-0 z-10 fixed" />}
    </>
  )
}

export default ResizablePanel
