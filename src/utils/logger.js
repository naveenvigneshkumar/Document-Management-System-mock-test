const { createLogger, format, transports } = require('winston');
require("dotenv").config();

const logOptions = (process.env.NODE_ENV === 'development')?  
new transports.Console({
    format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.json(),
    )
}):
new transports.File({
        filename: 'logs/app.log',
        format:format.combine(
            format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
            format.json(),
            
            // format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        )});
module.exports = createLogger({
transports:[
    logOptions
    ],
});


// new transports.File({
//     filename: 'logs/app.log',
//     format:format.combine(
//         format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
//         format.json(),
        
//         // format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
//     )})