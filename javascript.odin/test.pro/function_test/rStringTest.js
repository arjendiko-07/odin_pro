import reversestring from 'C:\Users\User\Desktop\FolderFT\test.pro\functions\rString.js';

test('reverse a string', ()=>{
    expected(reverseString('hello')).toBe('olleh');
});

test('reverse another string', ()=>{
    expected(reverseString('michrowave')).toBe('evaworhcim');
});