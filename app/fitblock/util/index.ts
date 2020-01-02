export function getRandHexNumByDigit(digitNum:number, radix:number):string
{
    const hexNums = [];
    for(let i = 0;i<digitNum;i++) {
        let num = Math.round(Math.random()*(radix-1));
        if(hexNums.length===0 && num===0){continue}
        hexNums.push(num.toString(radix));
    }
    return hexNums.join('');
}