const axios = require('axios');
const userCode = "Code-400";

// Fetch the base API URL dynamically
const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/ARYAN-STORE/ARYAN-ALL-API/refs/heads/main/api.json');
  return base.data.api;
};

module.exports.config = {
  name: "cat",
  aliases: [],
  version: "6.9.0",
  author: "NZ R",
  countDown: 0,
  role: 0,
  description: "better than all sim simi",
  category: "chat",
  guide: {
    en: "{pn} [anyMessage]",
  },
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  try {
    const link = `${await baseApiUrl()}/baby`;
    const inputText = args.join(" ").toLowerCase();
    const senderID = event.senderID;

    if (!args[0]) {
      return api.sendMessage("❌ | You must provide a valid command or input!", event.threadID, event.messageID);
    }

    switch (args[0]) {
      case 'remove': {
        const messageToRemove = inputText.replace("remove ", "");
        const response = await axios.get(`${link}?remove=${messageToRemove}&senderID=${userCode}`);
        return api.sendMessage(`✅ ${response.data.message}`, event.threadID, event.messageID);
      }

      case 'rm': {
        if (inputText.includes('-')) {
          const [target, index] = inputText.replace("rm ", "").split(' - ');
          const response = (await axios.get(`${link}?remove=${target}&index=${index}`)).data.message;
          return api.sendMessage(response, event.threadID, event.messageID);
        } else {
          return api.sendMessage("❌ | Invalid format for 'rm' command!", event.threadID, event.messageID);
        }
      }

      case 'list': {
        if (args[1] === 'all') {
          const data = (await axios.get(`${link}?list=all`)).data;
          const teachers = await Promise.all(
            data.teacher.teacherList.map(async (item) => {
              const teacherID = Object.keys(item)[0];
              const value = item[teacherID];
              const name = (await usersData.get(teacherID)).name || "Unknown";
              return { name, value };
            })
          );
          teachers.sort((a, b) => b.value - a.value);
          const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
          return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
        } else {
          const count = (await axios.get(`${link}?list=all`)).data.length;
          return api.sendMessage(`Total Teach = ${count}`, event.threadID, event.messageID);
        }
      }

      case 'msg': {
        const target = inputText.replace("msg ", "");
        const data = (await axios.get(`${link}?list=${target}`)).data.data;
        return api.sendMessage(`Message ${target} = ${data}`, event.threadID, event.messageID);
      }

      case 'edit': {
        const [oldMessage, newMessage] = inputText.replace("edit ", "").split(' - ');
        if (!newMessage) {
          return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
        }
        const response = (await axios.get(`${link}?edit=${oldMessage}&replace=${newMessage}&senderID=${senderID}`)).data.message;
        return api.sendMessage(`Changed ${response}`, event.threadID, event.messageID);
      }

      case 'teach': {
        const [input, reply] = inputText.replace("teach ", "").split(' - ');
        if (!reply) {
          return api.sendMessage('❌ | Invalid format! Use teach [YourMessage] - [Reply]', event.threadID, event.messageID);
        }
        const response = (await axios.get(`${link}?teach=${input}&reply=${reply}&senderID=${senderID}`)).data;

        // Teacher's name is always shown as Code-400
        const teacherName = "Code-400";
        return api.sendMessage(
          `✅ Replies added successfully!\nMessage: ${response.message}\nTeacher: ${teacherName}\nTeaches Count: ${response.teachs}`, 
          event.threadID, 
          event.messageID
        );
      }

      default: {
        const reply = (await axios.get(`${link}?text=${inputText}&senderID=${senderID}&font=1`)).data.reply;
        return api.sendMessage(reply, event.threadID, (error, info) => {
          if (!error) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: senderID,
              reply,
              apiUrl: link,
            });
          }
        }, event.messageID);
      }
    }
  } catch (error) {
    console.error(error);
    // Custom error message
    return api.sendMessage("Tomar sathe kotha nai ami rag korsi tumi pocha 😾", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event, Reply }) => {
  try {
    if (event.type === "message_reply") {
      const reply = (await axios.get(`${Reply.apiUrl}?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
      return api.sendMessage(reply, event.threadID, (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: Reply.commandName,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            reply,
          });
        }
      }, event.messageID);
    }
  } catch (err) {
    // Custom error message for onReply
    return api.sendMessage("Tomar sathe kotha nai ami rag korsi tumi pocha 😾", event.threadID, event.messageID);
  }
};
