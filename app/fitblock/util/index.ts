export function getRandHexNumByDigit(digitNum:number):string
{
    const num = Math.round(Math.random()*15);
    const hexNums = [];
    for(let i = 0;i<digitNum;i++) {
        hexNums.push(num.toString(16));
    }
    return hexNums.join('');
}