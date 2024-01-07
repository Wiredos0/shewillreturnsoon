  const axios = require("axios"); 

module.export const config = {
    name: "annie",
    author: "JARiF",
    version: "1.0",
    description: "talk with annie",
    guide: "[text]",
    restTime: 5,
    authority: 0,
    category: "AI"
    
}

export const annieStart = async function({ message, args }) {
    try {
        const userQuestion = args.join(' ');
        if (!userQuestion) {
            message.reply("You can't tell something?");
            return;
        }

       
        if (!global.hasOwnProperty("annie")) global.annie = {};

        const apiUrl = `https://simsimibn.simsimi-bn.repl.co/chat?ques=${encodeURIComponent(userQuestion)}`;
        const response = await axios.get(apiUrl);
        const botAnswer = response.data;

        if (!botAnswer) {
            message.reply('I could not understand your question. :(');
        } else {
            message.reply(botAnswer);
        }
    } catch (error) {
        console.error('Error occurred:', error.message);
        message.reply('An error occurred.');
    }
}