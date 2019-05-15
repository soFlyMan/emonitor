const log4js = require("log4js")

// log4js.configure({
//     appenders: {
//         console: { type: "console" }
//     },
//     app: {
//         type: "dateFile",
//         filename: "log/app",
//         pattern: "-yyyy-MM-dd.log",
//         alwaysIncludePattern: true
//     },
//     categories: {
//         default: {
//             appenders: ["console", "app"],
//             level: "trace"
//         }
//     },
//     pm2: false,
//     replaceConsole: true
// })

// log4js.configure({
//     categories: {
//         default: {
//             appenders: ["console", "app"],
//             level: "trace"
//         }
//     }
// })

module.exports = name => {
    let logger = log4js.getLogger(`[${name}]`)
    logger.level = 'trace'
    return logger
}