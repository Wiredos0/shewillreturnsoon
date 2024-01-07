module.exports = {
  config: {
    name: "SimSimiChat",
    version: "1.0.0",
    author: "Choru Offcial",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Mô tả ngắn tiếng Việt",
      en: "Short description in English"
    },
    longDescription: {
      uid: "User ID",
      en: "Long description in English"
    },
    category: "Chat",
    guide: {
      vi: "Hướng dẫn sử dụng tiếng Việt",
      en: "Usage guide in English"
    }
  },

  langs: {
    vi: {
      syntaxError: "Lỗi cú pháp"
    },
    en: {
      syntaxError: "Syntax error"
    }
  },

  onStart: async function ({ message, args, getLang }) {
    const { chat } = require('simsimi-sqlite');

    if (!args[0]) {
      const lang = getLang();
      return message.reply(lang.syntaxError);
    }

    try {
      const chatResponse = await chat(args.join(" "), "your-access-token");
      message.reply(`${chatResponse.result}`);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred during the chat.");
    }
  }
};