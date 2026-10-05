import addTwoNumbers from './add_two_numbers.asm?raw'
import binaryCounter from './binary_counter.asm?raw'
import bitMasking from './bit_masking.asm?raw'
import findLargest from './find_largest.asm?raw'
import hardwareInterrupts from './hardware_interrupts.asm?raw'
import keyboardInput from './keyboard_input.asm?raw'
import multiplyByAdding from './multiply_by_adding.asm?raw'
import overflow from './overflow.asm?raw'
import procedures from './procedures.asm?raw'
import reverseString from './reverse_string.asm?raw'
import sevenSegmentDisplay from './seven_segment_display.asm?raw'
import shifts from './shifts.asm?raw'
import softwareInterrupts from './software_interrupts.asm?raw'
import template from './template.asm?raw'
import trafficLightSequence from './traffic_light_sequence.asm?raw'
import trafficLights from './traffic_lights.asm?raw'
import visualDisplayUnit from './visual_display_unit.asm?raw'

const TITLE_REGEXP = /;\t(.*)/

const getTitleFrom = (content: string): string => TITLE_REGEXP.exec(content)![1]

interface Example {
  title: string
  content: string
}

const templateExample: Example = {
  title: getTitleFrom(template),
  content: template,
}

export { templateExample as template }

export const isTemplate = (value: string) => value === templateExample.content

export const templateSelection = (() => {
  const { title, content } = templateExample
  const titleIndex = content.indexOf(title)
  return {
    anchor: titleIndex,
    head: titleIndex + title.length,
  }
})()

export const examples: readonly Example[] = [
  addTwoNumbers,
  multiplyByAdding,
  overflow,
  findLargest,
  reverseString,
  binaryCounter,
  shifts,
  bitMasking,
  procedures,
  softwareInterrupts,
  hardwareInterrupts,
  keyboardInput,
  visualDisplayUnit,
  trafficLights,
  trafficLightSequence,
  sevenSegmentDisplay,
].map((content) => {
  return {
    title: getTitleFrom(content),
    content,
  }
})
