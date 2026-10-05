import { describe, expect, it } from 'vitest'

import { explainInstruction } from './explain'

describe('explainInstruction', () => {
  it('explains a load immediate', () => {
    expect(explainInstruction('MOV AL, 30')).toEqual({
      english: 'Put the value hex 30 into AL.',
      rtn: 'AL ← 30',
      cambridge: 'LDM #30',
    })
  })

  it('explains memory access and strips labels and comments', () => {
    expect(explainInstruction('Loop: MOV CL, [BL] ; read it')?.english).toBe(
      'Copy the value from the memory location whose address is held in BL into CL.',
    )
    expect(explainInstruction('MOV [80], AL')?.rtn).toBe('[80] ← AL')
  })

  it('explains arithmetic, jumps and I/O', () => {
    expect(explainInstruction('ADD AL, BL')?.rtn).toBe('AL ← AL + BL')
    expect(explainInstruction('JNZ Loop')?.cambridge).toBe('JPN Loop')
    expect(explainInstruction('OUT 01')?.english).toBe('Send the value in AL to the traffic lights.')
  })

  it('does not call register-indirect loads LDI', () => {
    expect(explainInstruction('MOV AL, [BL]')?.cambridge).toBeUndefined()
    expect(explainInstruction('MOV AL, [64]')?.cambridge).toBe('LDD 64')
  })

  it('returns null for unknown text', () => {
    expect(explainInstruction('')).toBeNull()
    expect(explainInstruction('FOO AL')).toBeNull()
  })
})
