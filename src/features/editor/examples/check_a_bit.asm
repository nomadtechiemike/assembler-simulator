; --------------------------------------
;	Check a Bit
; --------------------------------------
	; Type a key on the keyboard. The program tests bit 0 of its code.
	; Odd codes light the left red light, even codes the left green light.
Loop:
	IN   00			; Wait for a key. AL holds its ASCII code
	AND  AL, 01		; Mask off every bit except bit 0
	JZ   Even		; Zero means bit 0 was 0: an even code
	MOV  AL, 80		; Left red
	OUT  01
	JMP  Loop
Even:
	MOV  AL, 20		; Left green
	OUT  01
	JMP  Loop
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
