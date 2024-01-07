const axios = require("axios");

module.exports = {
  config: {
    name: "jakaria",
    version: "1.0",
    author: "Riley Nelson",//please don't change it
    countDown: 5,
    role: 0,
    shortDescription: {
      id: "Perintah untuk berinteraksi dengan AI",
      en: "Command to interact with AI"
    },
    longDescription: {
      id: "Perintah ini mengirim pertanyaan atau kueri ke AI dan mengembalikan jawabannya.",
      en: "This command sends a question or query to AI and returns the answer."
    },
    category: "AI",
    guide: {
      id: "Penggunaan: !ai [pertanyaan atau kueri]",
      en: "Usage: !ai [question or query]"
    }
  },

  onStart: async function ({ api, args, message, event }) {
    const prompt = args.join(" ");

    if (args.length === 0) {
      message.reply("Tuliskan pertanyaan atau kueri.");
      return;
    }

    const typingIndicator = api.sendTypingIndicator(event.threadID);

    try {
      message.reply("Looking for answers... Please wait ");

      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `https://api--kurgtahu.repl.co/ai/${encodedPrompt}`;
      
      const { data } = await axios.get(apiUrl);

      typingIndicator();

      if (data.url) {
        const drawUrl = data.url;
        const stream = await global.utils.getStreamFromURL(drawUrl);
        message.reply({ body: "This is the picture you asked for", attachment: stream });
      } else if (data.reply) {
        const replyMessage = data.reply;
        message.reply({ body: replyMessage });
      }
    } catch (error) {
      console.error(error);
      typingIndicator();
      message.reply(`${error}`);
    }
  }
};