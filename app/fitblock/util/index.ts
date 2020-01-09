export function getRandHexNumByDigit(digitNum:number, radix:number):string
{
    const hexNums = [];
    while(hexNums.length<digitNum) {
        let num = Math.round(Math.random()*(radix-1));
        if(hexNums.length===0 && num===0){continue}
        hexNums.push(num.toString(radix));
    }
    return hexNums.join('');
}

export function sleep(time=4):Promise<void> {
    return new Promise((reslove)=>{
        setTimeout(()=>{
            reslove()
        },time)
    });
}
