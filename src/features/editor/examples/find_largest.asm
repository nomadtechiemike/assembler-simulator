; --------------------------------------
;	Find the Largest Number
; --------------------------------------
	JMP  Start		; Jump past the data table
	DB   12
	DB   47
	DB   2A
	DB   63
	DB   05
	DB   00			; 00 marks the end of the list
Start:
	MOV  BL, 02		; BL points at the first number
	MOV  AL, [BL]	; AL holds the largest number found so far
Loop:
	INC  BL			; Move to the next number
	MOV  CL, [BL]	; Read it into CL
	CMP  CL, 00		; End of the list?
	JZ   Done
	CMP  AL, CL		; Compare largest so far with this number
	JNS  Loop		; AL is bigger or equal: keep it
	MOV  AL, 00		; CL is bigger, so it is the new largest.
	ADD  AL, CL		; There is no MOV AL, CL, so clear AL then add CL
	JMP  Loop
Done:
	OUT  01			; Show the answer 63 in binary on the traffic lights
	HALT
; --------------------------------------
	END
; --------------------------------------

For more examples, select File > Open Example.
