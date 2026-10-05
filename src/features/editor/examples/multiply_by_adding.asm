; --------------------------------------
;	Multiply by Repeated Addition
; --------------------------------------
	MOV  AL, 00		; AL holds the running total
	MOV  BL, 06		; The number to add
	MOV  CL, 04		; How many times to add it
Loop:
	ADD  AL, BL		; Add BL to the total
	DEC  CL			; One fewer addition left
	JNZ  Loop		; Repeat until CL is zero
	OUT  01			; 6 x 4 = 24 = 18 in hex (0001 1000)
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
