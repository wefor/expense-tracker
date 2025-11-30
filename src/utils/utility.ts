/**
 * Group an array of items by a given function
 * @param arr - The array of items to group
 * @param fn - The function to group the items by
 * @returns An object with the grouped items
 */
export const groupBy = <T>(arr: T[], fn: (item: T) => string | number) => {
    return arr.reduce((acc, cur) => {
        const key = fn(cur);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(cur);
        return acc;
    }, {} as Record<string | number, T[]>);
}