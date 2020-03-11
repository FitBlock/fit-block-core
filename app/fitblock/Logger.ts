export const getLoggerInstance = ( ()=> {
    let instance = null;
    return ():Logger=>{
        if(instance) {
            return instance;
        }
        instance = new Logger()
        return instance
    }
})();
type MyLogger = {
    log:Function,
    trace:Function,
    debug:Function,
    info:Function,
    warn:Function,
    error:Function,
}
export default class Logger {
    logger:MyLogger;
    constructor() {
        let isDev = false;
        for(const arg of process.argv) {
            if(arg==='--dev') {
                isDev = true;
                break;
            }
        }
        if(isDev) {
            this.logger = console;
        } else {
            // 由于前后端都要使用所以不能引用带fs模块的日志系统，那就暂时先忽略吧
            const ignoreFunc = ()=>{}
            this.logger = {
                log:ignoreFunc,
                trace:ignoreFunc,
                debug:ignoreFunc,
                info:ignoreFunc,
                warn:ignoreFunc,
                error:ignoreFunc,
            }
        }
    }

    getLogger() {
        return this.logger
    }
}