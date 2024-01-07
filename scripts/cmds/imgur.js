const axios = require('axios');

module.exports = {
  config: {
    name: "imgur",
    aliases: ["Imgur"],
    version: "1.1",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Upload image to Imgur"
    },
    longDescription: {
      en: "Upload image to Imgur by replying to a photo"
    },
    category: "tools",
    guide: {
      en: ""
    }
  },

  onStart: async function ({ api, event }) {
    const clientId = process.env.IMGUR_CLIENT_ID || '';
    const client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
    });

    const uploadImage = async (url) => {
      return (
        await client.post("image", {
          image: url,
        })
      ).data.data.link;
    };

    const array = [];

    if (event.type !== "message_reply" || event.messageReply.attachments.length === 0) {
      return api.sendMessage("Please reply to the photo you want to upload", event.threadID);
    }

    for (const { url } of event.messageReply.attachments) {
      try {
        const res = await uploadImage(url);
        array.push(res);
      } catch (err) {
        console.log(err);
      }
    }

    api.sendMessage(`» Successfully uploaded ${array.length} images\nFailed: ${event.messageReply.attachments.length - array.length}\n» Image links:\n${array.join("\n")}`, event.threadID);
  },
};
