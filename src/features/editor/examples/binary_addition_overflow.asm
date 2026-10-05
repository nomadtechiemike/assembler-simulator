; --------------------------------------
;	Binary Addition and Overflow
; --------------------------------------
	; An 8-bit register can only hold 00 to FF (0 to 255).
	MOV  AL, C8		; 200 in denary (1100 1000)
	OUT  01			; Show 200 on the traffic lights
	MOV  BL, 64		; 100 in denary (0110 0100)
	ADD  AL, BL		; 200 + 100 = 300, which needs 9 bits
	OUT  01			; AL holds 2C (44). The 9th bit was lost: overflow!
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
