; --------------------------------------
;	Add Two Numbers
; --------------------------------------
	MOV  AL, 05		; First number  (0000 0101)
	MOV  BL, 03		; Second number (0000 0011)
	ADD  AL, BL		; AL = AL + BL, so AL is now 08 (0000 1000)
	OUT  01			; Show the result in binary on the traffic lights
	MOV [80], AL	; Store the result in memory at address 80
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
