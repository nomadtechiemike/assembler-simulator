# Assembler Simulator

[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

The Assembler Simulator is an 8-bit CPU simulation tool that utilizes the "Samphire" sms32v50 [Microprocessor Simulator] instruction set, which is analogous to the Intel 8086 architecture. Originally, a native desktop application based on this instruction set was employed at University College Cork to facilitate the teaching of the CS1111 Systems Organisation module. However, it was limited to the Windows operating system.

This fork builds a responsive learning workspace, guided practice, and a choice of light, dark, or system theme. The original project endeavors to replicate the functionality of the "Samphire" application as closely as possible, using:

- [CodeMirror 6](https://codemirror.net/6/) for code editing with syntax highlighting
- [React](https://reactjs.org/) for building user interfaces
- [Redux](https://redux.js.org/) for state management
- [RxJS](https://rxjs.dev/) for reactive programming
- [Vite](https://vitejs.dev/) for fast development and build tooling
- [TypeScript](https://www.typescriptlang.org/) for static type checking

Experience the Assembler Simulator online [here](https://assembler-simulator.techiemike.com/).

## Features

- An 8-bit CPU simulation with four general-purpose registers
- A memory model with 256 bytes of RAM
- Support for procedures and subroutines
- Implementation of software and hardware interrupts
- Keyboard input handling
- A suite of output devices, including:
  - A memory-mapped Visual Display Unit
  - Simulated traffic lights
  - A seven-segment display
  - Additional devices planned for future updates
- Debugging features like breakpoints and step-by-step execution
- An integrated editor equipped with syntax highlighting for a seamless coding experience
- A responsive workspace with CPU, memory, I/O, and guided learning views
- Light, dark, and system theme options
- Step feedback showing the latest register and memory changes

## Acknowledgements

This project draws inspiration from and extends gratitude to the following works:

- [osslate/babassu](https://github.com/osslate/babassu) - A heartfelt thank you! 😀
- [Schweigi/assembler-simulator](https://github.com/Schweigi/assembler-simulator)
- [parraman/asm-simulator](https://github.com/parraman/asm-simulator)

## License

[GPL-3.0 License](LICENSE) © 2022-Present [Exuanbo](https://github.com/exuanbo)
