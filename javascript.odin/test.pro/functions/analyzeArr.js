export default function analyzeArray(arr) {
const average =
    arr.reduce((sum, num) => sum + num, 0) / arr.length;

return {
    average,
    min: Math.min(...arr),
    max: Math.max(...arr),
    length: arr.length,
};
}