const unsafeChars = ['/', '\\', '\'', '>', '<', '='];
export function isSafeString(strValue: string): boolean {
    return !unsafeChars.some(char => strValue.includes(char));
}
