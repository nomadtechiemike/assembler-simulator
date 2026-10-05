; --------------------------------------
;	Reverse a String Using the Stack
; --------------------------------------
	JMP  Start		; Jump past the data table
	DB   "Hello World!"
	DB   00
Start:
	MOV  BL, 02		; BL points at the first character
Push:
	MOV  AL, [BL]	; Read a character
	CMP  AL, 00		; End of the string?
	JZ   Show
	PUSH AL			; Put the character on the stack
	INC  BL
	JMP  Push
Show:
	MOV  CL, C0		; CL points at video RAM
Pop:
	POP  AL			; Last in, first out: the characters come back reversed
	MOV [CL], AL	; Write the character to the display
	INC  CL
	DEC  BL
	CMP  BL, 02		; All characters popped?
	JNZ  Pop
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
