const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "drawever",
    aliases: ["drw"],
    version: "1.0",
    author: "JARiF",
    countDown: 15,
    role: 0,
    category: "Art",
    guide: {
      en: "{pn} prompt"
    }
  },

  onStart: async function ({ api, event, message, args }) {
    try {
      let imageUrl;

      if (event.type === "message_reply") {
        const replyAttachment = event.messageReply.attachments[0];

        if (["photo", "sticker"].includes(replyAttachment?.type)) {
          imageUrl = replyAttachment.url;
        } else {
          return api.sendMessage(
            { body: "❌ | Reply must be an image." },
            event.threadID
          );
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
        imageUrl = args[0];
      } else {
        return api.sendMessage({ body: "❌ | Reply to an image." }, event.threadID);
      }

      const url = await tinyurl.shorten(imageUrl);
      const waitingMessage = await api.sendMessage("Please wait...", event.threadID);

      const res = await axios.get(`https://www.annie-jarif.repl.co/draw?imageUrl=${encodeURIComponent(url)}`);
      const data = res.data;
      const imgData = [];

      for (let i = 0; i < data.length; i++) {
        const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData
      }, event.threadID);

      await fs.remove(path.join(__dirname, 'cache'));
    } catch (error) {
      console.error(error);
      return api.sendMessage(error.message, event.threadID);
    }
  }
};
