const { getStreamFromUrl } = global.utils;

module.exports = {
  config: {
    name: "resend",
    version: "5.0",
    author: "sadman anik - fixed & modified by Sheikh Farid",
    countDown: 1,
    role: 2,
    shortDescription: {
      en: "Enable/Disable Anti unsend mode"
    },
    longDescription: {
      en: "Anti unsend mode. works with audio, video, and images"
    },
    category: "Admins",
    guide: {
      en: "{pn} on or off\nex: {pn} on"
    },
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ api, message, event, threadsData, args }) {
    let resend = await threadsData.get(event.threadID, "settings.reSend");

    if (resend === undefined) {
      await threadsData.set(event.threadID, true, "settings.reSend");
      resend = true;
    }

    if (!["on", "off"].includes(args[0])) {
      return message.reply("Invalid argument. Use 'on' or 'off'.");
    }

    const enableResend = args[0] === "on";
    await threadsData.set(event.threadID, enableResend, "settings.reSend");

    if (enableResend) {
      if (!global.reSend) {
        global.reSend = {};
      }
      if (!global.reSend.hasOwnProperty(event.threadID)) {
        global.reSend[event.threadID] = await api.getThreadHistory(event.threadID, 100, undefined);
      }
    } else {
      if (global.reSend && global.reSend.hasOwnProperty(event.threadID)) {
        delete global.reSend[event.threadID];
      }
    }

    return message.reply(`${enableResend ? "Anti unsend mode enabled" : "Anti unsend mode disabled"}`);
  },

  onChat: async function ({ api, threadsData, event, usersData }) {
    if (event.type === "message_unsend") {
      let resend = await threadsData.get(event.threadID, "settings.reSend");
      if (!resend) return;

      if (!global.reSend) {
        global.reSend = {};
      }
      if (!global.reSend.hasOwnProperty(event.threadID)) {
        global.reSend[event.threadID] = [];
      }

      const unsentMessage = global.reSend[event.threadID].find(msg => msg.messageID === event.messageID);
      if (unsentMessage) {
        const senderData = await usersData.get(unsentMessage.senderID);
        const senderName = senderData ? senderData.name : unsentMessage.senderID;

        let messageToSend = `${senderName} was unsend ✅\n\n${unsentMessage.body || ''}`;

        if (unsentMessage.attachments && unsentMessage.attachments.length > 0) {
          const attachments = await Promise.all(unsentMessage.attachments.map(async attachment => {
            if (["photo", "video", "audio", "file","mp3"].includes(attachment.type)) {
              return await getStreamFromUrl(attachment.url);
            }
          }));

          api.sendMessage({ body: messageToSend, attachment: attachments.filter(Boolean) }, event.threadID);
        } else {
          api.sendMessage(messageToSend, event.threadID);
        }
      }

      global.reSend[event.threadID] = global.reSend[event.threadID].filter(msg => msg.messageID !== event.messageID);
    } else {
      let resend = await threadsData.get(event.threadID, "settings.reSend");
      if (!resend) return;

      if (!global.reSend) {
        global.reSend = {};
      }
      if (!global.reSend.hasOwnProperty(event.threadID)) {
        global.reSend[event.threadID] = [];
      }
      global.reSend[event.threadID].push(event);

      if (global.reSend[event.threadID].length > 50) {
        global.reSend[event.threadID].shift();
      }
    }
  }
};
