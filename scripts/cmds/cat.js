const axios = require("axios");

const generateRandomUID = () => Math.floor(Math.random() * 10) + 1;
const userCode = "Code-143";

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
                "Bolo meow.? 😺", "Hum bole felo", "bolbq kichu?", "Meow Meow Meowwwwwww 😻",
                " YES, Meowww 😻🐾", "HEY, Yessss Meoww 😼🐾", "hey I am here😻"
            ];
            return message.reply(responses[Math.floor(Math.random() * responses.length)]);
        }

        if (args[0].toLowerCase() === "teach") {
            const [messageToTeach, replies] = userMessage.replace("teach ", "").split(/\s*-\s*/);
            if (!replies) return message.reply("❌ | Invalid format! Use teach [YourMessage] - [Reply1], [Reply2], [Reply3]...");
            const maskedUserID = generateRandomUID();
            const response = await axios.get(`${link}?teach=${messageToTeach}&reply=${replies}&senderID=${maskedUserID}`);
            return message.reply(`✅ Replies added: ${response.data.message}\nTeacher: ${userCode}\nTeaches: ${response.data.teachs}`);
        }

        if (args[0].toLowerCase() === "remove") {
            const messageToRemove = userMessage.replace("remove ", "");
            const response = await axios.get(`${link}?remove=${messageToRemove}&senderID=${userCode}`);
            return message.reply(`✅ ${response.data.message}`);
        }

        if (args[0].toLowerCase() === "list") {
            const response = await axios.get(`${link}?list=${userId}`);
            return message.reply(`Current responses:\n${response.data.responses.join("\n")}`);
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
    version: "1.1",
    author: "NZ R | NOTHING",
    countDown: 10,
    role: 0,
    description: "Enhanced command for user interaction.",
    category: "box chat",
    guide: {
        en: "{pn}[anyMessage]",
    },
};

module.exports = {
    config: metalovesNehal,
    handleCommand: nehallovesMeta,
    onStart: nehallovesMeta,
    onReply: nehallovesMeta
};
