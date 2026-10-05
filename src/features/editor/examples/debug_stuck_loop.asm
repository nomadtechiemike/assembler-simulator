; --------------------------------------
;	Debug Me 1: Stuck Loop
; --------------------------------------
	; Task: this should add 5+4+3+2+1 and show 0F on the lights.
	; It never finishes. Find the bug and fix it.
	MOV  AL, 00		; Total
	MOV  CL, 05		; Counter
Loop:
	ADD  AL, CL		; Add the counter to the total
	CMP  CL, 00		; Is the counter zero?
	JNZ  Loop
	OUT  01
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
