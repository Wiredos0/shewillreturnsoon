const axios = require('axios');
const baseApiUrl = async () => {
    const base = await axios.get('https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json');
    return base.data.api;
};

module.exports.config = {
    name: "cat",
    aliases: [],
    version: "7.0.0",
    author: "NZ R",
    countDown: 0,
    role: 0,
    description: "Talk With CaT Araa",
    category: "chat",
    guide: {
        en: "{pn} <anyMessage>"
    }
};

module.exports.onStart = async ({ api, event, args }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    let command, comd, final;

    try {
        if (!args[0]) {
            const randomMessages = [
                "HEY!! Meoww!!", 
                "Humm bolen ki bolte chan", 
                "Please type something!", 
                "YES! Meoww??",
                "You called me, but didn't say anything!",
                "I'm here! What's on your mind?",
                "Need help? Just type something!",
                "Oops! Forgot what you wanted to say?",
                "Talk to me! I’m listening!",
                "Silent treatment, huh?",
                "I'm all ears, type something!",
                "Why so quiet? Say something!",
                "Anything on your mind? Let me know!",
                "Hello? Don't leave me hanging!",
                "You rang? Tell me more!",
                "What’s up? Type your message!",
                "Don't be shy, I'm here for you!",
                "Cat got your tongue? Type it out!",
                "A little input would help me respond better!",
                "Waiting for your message patiently!",
                "I'm ready when you are!",
                "Type something magical, I'm waiting!"
            ];
            return api.sendMessage(randomMessages[Math.floor(Math.random() * randomMessages.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=6969`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(' - ');
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const output = data.teacher.teacherList.map(item => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    return { name: "SyntaxErrorDev", value };
                }).sort((a, b) => b.value - a.value).map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data.length;
                return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=6969`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&reply=${command}&senderID=6969`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: SyntaxErrorDev`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=6969&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=6969`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID, d, apiUrl: link });
        }, event.messageID);
    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=6969`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID, a });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        if (body.startsWith("faaakhjdnhdjd") || body.startsWith("bksjshxbfbfjffjj") || body.startsWith("nsjxhbrndhdbdbxbcb")) {
            const arr = body.replace(/^\S+\s*/, "");
            if (!arr) {
                return api.sendMessage("Yes! do you know me?", event.threadID, (error, info) => {
                    global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID });
                }, event.messageID);
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=6969`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, type: "reply", messageID: info.messageID, author: event.senderID, a });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
