; --------------------------------------
;	Debug Me 2: Wrong Answer
; --------------------------------------
	; Task: this should work out 6 x 4 = 24 (18 in hex) by repeated addition.
	; It shows the wrong answer. Use Step and the Trace tab to find out why.
	MOV  AL, 00		; Total
	MOV  BL, 06		; The number to add
	MOV  CL, 04		; How many times
Loop:
	ADD  AL, CL
	DEC  CL
	JNZ  Loop
	OUT  01
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
