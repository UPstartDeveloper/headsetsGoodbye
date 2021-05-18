export const compareFloatsinArrays = (a, b) => {
    /* Performs element-wise comparision of two arrays, comparing elements at corresponding indices.
     * This code snippet originally found here: https://www.30secondsofcode.org/blog/s/javascript-array-comparison
     * @param: {Array} a: the first array of floating point values
     * @param: {Array} b: the second array of floating point numbers  parseFloat(value) < parseFloat(max)
     * @return {boolean}
     */
    return (
        // first, compare the length of the array
        a.length === b.length && 
        // then, compare the elements in the arrays
        a.every((value, index) => {
            // but first, make sure to round so small variations don't throw us off
            let firstValue = Number((value).toFixed(4));
            let secondValue = Number((b[index]).toFixed(4));
            return firstValue === secondValue; 
        })
    );
}