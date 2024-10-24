const axios = require("axios");

const baseApiUrl = async () => {
    const response = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
    );
    return response.data.api;
};

const nehallovesMeta = async ({ api, event, args, usersData, message }) => {
    const link = `${await baseApiUrl()}/baby`;
    const userMessage = args.join(" ").toLowerCase();
    const userId = event.senderID;

    try {
        if (!args[0]) {
            const responses = [
                "Bolo miew", "hum", "Meow meow 😺", "Yesh meow ", 
                "miw meow", "Hey 😺✨", "hey I am here😃","kemon acho meow", "yes yes?" 
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            return message.reply(randomResponse);
        }

        if (args[0].toLowerCase() === "teach") {
            const [messageToTeach, replies] = userMessage.replace("teach ", "").split(/\s*-\s*/);
            if (!replies) {
                return message.reply("❌ | Invalid format! Use teach [YourMessage] - [Reply1], [Reply2], [Reply3]...");
            }
            const response = await axios.get(`${link}?teach=${messageToTeach}&reply=${replies}&senderID=${userId}`);
            const userName = await usersData.getName(userId);
            return message.reply(`✅ Replies added: ${response.data.message}\nTeacher: ${userName || "none"}\nTeaches: ${response.data.teachs}`);
        }

        const response = await axios.get(`${link}?text=${userMessage}`);
        message.reply(response.data.reply, (replyError, replyMessage) => {
            if (!replyError) {
                global.GoatBot.onReply.set(replyMessage.messageID, {
                    commandName: "cat",
                    uid: userId
                });
            }
        });

    } catch (error) {
        console.error("Error during onStart:", error);
        return message.reply("An error occurred, check the console for details.");
    }
};

const metalovesNehal = {
    name: "cat",
    aliases: [],
    version: "1.0",
    author: "NZ R | NARUTO",
    countDown: 0,
    role: 0,
    description: "Talk with CaT Araa",
    category: "box chat",
    guide: {
        en: "{pn} <anyMessage>",
    },
};

module.exports = {
    config: metalovesNehal,
    handleCommand: nehallovesMeta,
    onStart: nehallovesMeta,
    onReply: nehallovesMeta
};
