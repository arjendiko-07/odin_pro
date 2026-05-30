export default function caesarCipher(str, shift) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    return str
        .split('')
        .map(char => {
            const lower = char.toLowerCase();

            if (!alphabet.includes(lower)) {
                return char;
            }

            let index = alphabet.indexOf(lower);
            let newIndex = (index + shift) % 26;

            let shifted = alphabet[newIndex];

            if (char === char.toUpperCase()) {
                shifted = shifted.toUpperCase();
            }

            return shifted;
        })
        .join('');
}