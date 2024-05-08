export function numberOfDuplicates(arrA: Array<string>, arrB: Array<string>) {
    const shorterArr = arrA.length > arrB.length ? arrB : arrA;
    const longerArr = arrA.length > arrB.length ? arrA : arrB;
    return longerArr.filter((value) => shorterArr.includes(value)).length;
}
