const axios = require('axios');

module.exports = {
  config: {
    name: "s4",
    aliases: ["mage"], 
    version: "1.0",
    author: "Samir Œ",
    countDown: 60,
    role: 0,
    shortDescription: "anime image generator",
    longDescription: "",
    category: "image",
    guide: {
      en: "{pn} <prompt>  --ar 16:9"
    }
  },

  onStart: async function ({ message, args }) {
    let prompt = args.join(" ");

    try {
      const apiUrl = `https://samirxpikachuio.onrender.com/mageDef?prompt=${encodeURIComponent(prompt)}`;
      
      const imageStream = await global.utils.getStreamFromURL(apiUrl);

      if (!imageStream) {
        return message.reply("Failed to retrieve image.");
      }
      
      return message.reply({
        body: `✅ | Here's your \`s4\`:\n\n${prompt}`,
        attachment: imageStream
      });
    } catch (error) {
      console.error(error);
      return message.reply("Failed to retrieve image.");
    }
  }
};
