const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    version: "1.0",
    author: "OtinXSandip",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "lyrics"
    },
longDescription: {
en: "lyrics"
},
    category: "media",
    guide: {
      en: "{pn} <title>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const lyrics = args.join(' ');
      if (!lyrics) {
        return message.reply("Please provide a song title!");
      }
      api.setMessageReaction("👅", event.messageID, () => { }, true);
      const { data } = await axios.get(`https://nemobot.otinxshiva10.repl.co/lyrics`, {
        params: {
          query: lyrics
        }
      });
      api.setMessageReaction("🎶", event.messageID, () => { }, true);
      const messageData = {
        body: `╭ Title: ${data.title || ''}\n╰ Artist: ${data.artist || ''}\n\n- Lyrics:\n\n${data.lyrics || ''}`,
        attachment: await global.utils.getStreamFromURL(data.image)
      };
      return message.reply(messageData);
    } catch (error) {
      console.error(error);
      return message.reply("An error occurred while fetching lyrics!");
    }
  }
};