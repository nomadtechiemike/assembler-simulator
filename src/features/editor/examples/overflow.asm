; --------------------------------------
;	Overflow
; --------------------------------------
	MOV  AL, 7F		; 127, the largest positive 8-bit two's complement number
	ADD  AL, 01		; 127 + 1 = 128, which does not fit, so AL becomes 80 (-128)
	JO   Overflow	; Jump if the overflow flag was set
	MOV  AL, 00
	OUT  01			; No overflow: all lights off
	HALT
Overflow:
	MOV  AL, FC
	OUT  01			; Overflow detected: all lights on
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
