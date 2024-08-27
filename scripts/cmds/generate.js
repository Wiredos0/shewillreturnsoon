const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "generate",
    aliases: ["gen","genx"],
    version: "1.0",
    author: "Vex_Kshitiz",
    countDown: 60,
    role: 0,
    longDescription: {
      vi: '',
      en: "Generate images"
    },
    category: "ai",
    guide: {
      vi: '',
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, commandName, event, args }) {
    try {
      api.setMessageReaction("✅", event.messageID, (a) => {}, true);
      const prompt = args.join(' ');

      const apiKey = 'YOUR_API_KEY_HERE';  // Replace with your actual API key
      const response = await axios.get(`https://dall-e-tau-steel.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}&apiKey=${apiKey}`);
      const imageUrl = response.data.response;

      const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imgPath = path.join(__dirname, 'cache', 'dalle_image.jpg');
      await fs.outputFile(imgPath, imgResponse.data);
      const imgData = fs.createReadStream(imgPath);

      await api.sendMessage({ body: `Generated Successfully ✅\n\n${prompt}`, attachment: imgData }, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("Error generating image. Please try again later.", event.threadID, event.messageID);
    }
  }
};
