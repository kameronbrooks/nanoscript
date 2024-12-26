import * as prg from '../src/nsengine/program';

describe('ops', () => {
    test('equal number of opcodes and names', () => {
        expect(prg.OP_NAMES.length).toBe(prg.OP_CALL_EXTERNAL + 1);

    });
});