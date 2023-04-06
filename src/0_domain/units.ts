function isUpperCase(char: string): boolean {
    return (char.toUpperCase() == char)
}

export function prettyFromCamelCase(camelCase: string): string {
    let count = 0
    const letters = camelCase.split('').map(letter =>
    {
        if(count++ == 0) return letter.toUpperCase()
        if (isUpperCase(letter)) return ` ${letter}`
        return letter;
    })
    return letters.join('')
}
