; --------------------------------------
;	Bit Masking
; --------------------------------------
Loop:
	MOV  AL, 00		; 0000 0000  Start with all lights off
	OUT  01
	MOV  BL, 10
	CALL 40
	OR   AL, A0		; 1010 0000  OR switches bits on
	OUT  01
	MOV  BL, 10
	CALL 40
	OR   AL, 08		; 1010 1000  Switch on one more bit
	OUT  01
	MOV  BL, 10
	CALL 40
	XOR  AL, FC		; 0101 0100  XOR flips (toggles) the bits
	OUT  01
	MOV  BL, 10
	CALL 40
	AND  AL, F0		; 0101 0000  AND masks bits off
	OUT  01
	MOV  BL, 10
	CALL 40
	JMP  Loop
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
