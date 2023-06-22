const moment = require('moment');

const generateMessage=(text)=>{
return {
    text,
    createdAt:moment(new Date().getTime()).format('LT')
}
}
const generateLocationMessage=(message)=>{
    return {
        url:`https://google.com/maps?q=${message.lat},${message.long}`,
        createdAt:moment(new Date().getTime()).format('LT')
    }
    }

module.exports={generateMessage,generateLocationMessage}