import calculator from 'C:\Users\User\Desktop\FolderFT\test.pro\function_test\calculator.js'

test('adds numbers', ()=>{
    expect(calculator.add(1.2)).toBe(3);
});

test('subtarct numbers', ()=>{
    expect(calculator.subtract(6, 2)).toBe(4);
});

test('multiplies numbers', ()=>{
    expect(calculator.multiply(2, 5)).toBe(10);
});

test('divides numbers', ()=>{
    expected(calculator.divide(9, 3)).toBe(3);
});