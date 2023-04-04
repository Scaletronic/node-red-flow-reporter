"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyFromCamelCase = void 0;
function isUpperCase(char) {
    return (char.toUpperCase() == char);
}
function prettyFromCamelCase(camelCase) {
    let count = 0;
    const letters = camelCase.split('').map(letter => {
        if (count++ == 0)
            return letter.toUpperCase();
        if (isUpperCase(letter))
            return ` ${letter}`;
        return letter;
    });
    return letters.join('');
}
exports.prettyFromCamelCase = prettyFromCamelCase;
