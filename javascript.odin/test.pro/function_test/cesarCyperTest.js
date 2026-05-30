import caesarCipher from '../functions/caesarCipher.js';

test('shifts letter', () => {
    expect(caesarCipher('abc', 2)).toBe('cde');
});

test('wraps around alphabet', () => {
    expect(caesarCipher('xyz', 2)).toBe('zab');
});

test('preserve uppercase/lowercase', () => {
    expect(caesarCipher('Anna', 2)).toBe('Cppc');
});

test('keeps punctuation', () => {
    expect(caesarCipher('Hello, World!', 3)).toBe('Khoor, Zruog!');
});