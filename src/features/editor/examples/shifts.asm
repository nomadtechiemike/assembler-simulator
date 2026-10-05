; --------------------------------------
;	Shifts: Multiply and Divide by Two
; --------------------------------------
	MOV  AL, 01		; Start with a single bit
Left:
	OUT  01			; Show AL on the traffic lights
	MOV  BL, 08
	CALL 40
	CMP  AL, 80		; Reached the left-hand end?
	JZ   Right
	SHL  AL			; Shift left: multiply by two
	JMP  Left
Right:
	OUT  01
	MOV  BL, 08
	CALL 40
	CMP  AL, 01		; Back at the right-hand end?
	JZ   Left
	SHR  AL			; Shift right: divide by two
	JMP  Right
; --------------------------------------
	ORG  40
Delay:
	DEC  BL
	JNZ  Delay
	RET
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
