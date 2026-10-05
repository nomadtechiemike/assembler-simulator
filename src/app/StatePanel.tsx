import { type FC, useState } from 'react'

import CpuRegisters from '@/features/cpu/CpuRegisters'
import IoDevices from '@/features/io/IoDevices'
import Memory from '@/features/memory/Memory'

import CyclePanel from './CyclePanel'
import LearningPanel from './LearningPanel'
import ListingPanel from './ListingPanel'
import StepInsights from './StepInsights'
import TracePanel from './TracePanel'

type Panel = 'cpu' | 'memory' | 'io' | 'trace' | 'cycle' | 'code' | 'learn'

const tabs: { id: Panel, label: string }[] = [
  { id: 'cpu', label: 'CPU' },
  { id: 'memory', label: 'Memory' },
  { id: 'io', label: 'I/O' },
  { id: 'trace', label: 'Trace' },
  { id: 'cycle', label: 'Cycle' },
  { id: 'code', label: 'Code' },
  { id: 'learn', label: 'Learn' },
]

const StatePanel: FC = () => {
  const [active, setActive] = useState<Panel>('cpu')

  return (
    <aside aria-label="Simulator state and learning" className="state-panel">
      <StepInsights />
      <div aria-label="State views" className="state-tabs" role="tablist">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            aria-controls={`panel-${id}`}
            aria-selected={active === id}
            id={`tab-${id}`}
            role="tab"
            type="button"
            onClick={() => setActive(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="state-panel-content">
        <section aria-labelledby="tab-cpu" hidden={active !== 'cpu'} id="panel-cpu" role="tabpanel">
          <CpuRegisters />
        </section>
        <section
          aria-labelledby="tab-memory"
          hidden={active !== 'memory'}
          id="panel-memory"
          role="tabpanel">
          <Memory />
        </section>
        <section aria-labelledby="tab-io" hidden={active !== 'io'} id="panel-io" role="tabpanel">
          <IoDevices />
        </section>
        <section
          aria-labelledby="tab-trace"
          hidden={active !== 'trace'}
          id="panel-trace"
          role="tabpanel">
          <TracePanel />
        </section>
        <section aria-labelledby="tab-cycle" hidden={active !== 'cycle'} id="panel-cycle" role="tabpanel">
          <CyclePanel />
        </section>
        <section aria-labelledby="tab-code" hidden={active !== 'code'} id="panel-code" role="tabpanel">
          <ListingPanel />
        </section>
        <section
          aria-labelledby="tab-learn"
          hidden={active !== 'learn'}
          id="panel-learn"
          role="tabpanel">
          <LearningPanel />
        </section>
      </div>
    </aside>
  )
}

export default StatePanel
