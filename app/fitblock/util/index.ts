export function getRandHexNumByDigit(digitNum:number, radix:number):string
{
    const num = Math.round(Math.random()*(radix-1));
    const hexNums = [];
    for(let i = 0;i<digitNum;i++) {
        hexNums.push(num.toString(radix));
    }
    return hexNums.join('');
}