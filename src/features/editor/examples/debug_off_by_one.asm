; --------------------------------------
;	Debug Me 3: Off by One
; --------------------------------------
	; Task: the lights should count 1, 2, 3, 4, 5 and then stop.
	; Watch the output. Which number is missing, and why?
	MOV  AL, 00
Loop:
	INC  AL
	CMP  AL, 05
	JZ   Done
	OUT  01
	MOV  BL, 10
	CALL 40
	JMP  Loop
Done:
	HALT
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
