import capitalize from 'C:\Users\User\Desktop\FolderFT\test.pro\functions\capital.js';

test('capitalizes first letter', ()=>{
    expected(capitalize('hello')).toBe('Hello');
});

test('works with alredy capitalized word', ()=>{
    expected(capitalize('World')).toBe('World');
})
