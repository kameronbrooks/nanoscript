import { OP_LOAD_CONST_FLOAT, Program } from "./program";

export class NSBinaryComplier {
    stringToBytes(str: string): Uint8Array {
        let bytes = new Uint8Array(str.length+1);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        bytes[str.length] = '\0'.charCodeAt(0); 
        return bytes;
    }

    appendBytes(buffer: Uint8Array, bytes: Uint8Array, offset: number): number {
        for (let i = 0; i < bytes.length; i++) {
            buffer[offset++] = bytes[i];
        }
        return offset;
    }

    compileBinary(program: Program): Uint8Array {
        const instructions = [...program.instructions];

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            const opcode = instruction.opcode;
            const operand = instruction.operand; 
        }

        let instructionBuffer = new ArrayBuffer(instructions.length * (4+8));
        let instructionView = new DataView(instructionBuffer);

        let constByteOffset = 0;
        let instructionByteOffset = 0;

        const constByteObjects: Uint8Array[] = [];

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            const opcode = instruction.opcode;
            const operand = instruction.operand;
            console.log(opcode, operand);
            instructionView.setInt32(instructionByteOffset, opcode, true);
            instructionByteOffset += 4;

            if (operand) {
                if (typeof operand === "number") {
                    console.log("number: " + operand);
                    if (opcode === OP_LOAD_CONST_FLOAT) {
                        instructionView.setFloat64(instructionByteOffset, operand, true);
                    } else {
                        instructionView.setInt32(instructionByteOffset, operand, true);
                    }
                    instructionByteOffset += 8;
                } else if (typeof operand === "boolean") {
                    console.log("boolean: " + operand);
                    instructionView.setUint8(instructionByteOffset, operand ? 1 : 0);
                    instructionByteOffset += 8;
                } else if (typeof operand === "string") {
                    console.log("string: " + operand);
                    const bytes = this.stringToBytes(operand);
                    // TODO: Add the offset to the const buffer
                    const constAddress = constByteOffset;
                    constByteOffset += bytes.length;
                    constByteObjects.push(bytes);

                    instructionView.setInt32(instructionByteOffset, constAddress , true);
                    instructionByteOffset += 8;
                
                } else {
                    console.log("something else: " + operand);
                    instructionView.setBigInt64(instructionByteOffset, BigInt(0) , true);
                    instructionByteOffset += 8;
                }
            } else {
                console.log("no operand");
                instructionView.setBigInt64(instructionByteOffset, BigInt(0) , true);
                instructionByteOffset += 8;
            }
        }

        let constBuffer = new ArrayBuffer(constByteOffset);
        let constView = new Uint8Array(constBuffer);
        constByteOffset = 0;
        for (let i = 0; i < constByteObjects.length; i++) {
            constByteOffset = this.appendBytes(constView, constByteObjects[i], constByteOffset);
        }

        let programBuffer = new ArrayBuffer(instructionByteOffset + constByteOffset);
        let programView = new Uint8Array(programBuffer);
        let pIndex = 0;
        for (let i =0; i < constBuffer.byteLength; i++) {
            programView[pIndex] = constView[pIndex];
            pIndex++;
        }
        for (let i =0; i < instructionBuffer.byteLength; i++) {
            programView[pIndex] = instructionView.getUint8(pIndex);
            pIndex++;
        }



        return new Uint8Array(programBuffer);
    }
}