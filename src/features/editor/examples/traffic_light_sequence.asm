; --------------------------------------
;	Traffic Light Sequence
; --------------------------------------
	; Left light = bits 7-5 (red, yellow, green)
	; Right light = bits 4-2 (red, yellow, green)
Loop:
	MOV  AL, 30		; Left green, right red
	OUT  01
	MOV  BL, 08		; Long delay
	CALL 40
	MOV  AL, 50		; Left yellow, right red
	OUT  01
	MOV  BL, 02		; Short delay
	CALL 40
	MOV  AL, 84		; Left red, right green
	OUT  01
	MOV  BL, 08		; Long delay
	CALL 40
	MOV  AL, 88		; Left red, right yellow
	OUT  01
	MOV  BL, 02		; Short delay
	CALL 40
	JMP  Loop
; --------------------------------------
	ORG  40
Rep:
	DEC  BL			; Subtract one from BL
	JNZ  Rep
	RET
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
