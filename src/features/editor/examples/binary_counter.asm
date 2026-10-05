; --------------------------------------
;	Binary Counter
; --------------------------------------
	MOV  AL, 00		; Start counting at zero
Loop:
	OUT  01			; Show the count in binary on the traffic lights
	INC  AL			; Add one to the count
	MOV  BL, 10		; Delay length
	CALL 40			; Call the delay procedure
	JMP  Loop
; --------------------------------------
	ORG  40
Delay:
	DEC  BL			; Subtract one from BL
	JNZ  Delay		; Repeat until BL is zero
	RET
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
