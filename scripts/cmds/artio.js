const axios = require("axios");
let Romim, download, send, apireq;
let name = "artio";

module.exports.config = {
  name: name,
  category: "Image",
  author: "Sahadat Hossen",
  countDown: 60,
};

module.exports.onStart = async function ({ message, api, event, args }) {
  Romim = args.join("");
  const soru = new Date().getTime();
  const { threadID, messageID } = event;
  send = api.sendMessage("⏳ | Generating your art, Please wait...", threadID, messageID);

  if (!Romim) {
    api.sendMessage("please give me a prompt ", threadID, messageID);
    return;
  }

  try {
    apireq = (`https://mostakim.onrender.com/art2?prompt=${Romim}`);

    const joinat = await global.utils.getStreamFromURL(apireq);

    api.setMessageReaction("✅", event.messageID, (err) => {}, true);

    message.unsend(send.messageID);

    const time = new Date().getTime();
    await message.reply({
      body: `🎨 Here's your Artful image\nTime taken: ${(time - soru) / 1000} sec(s)`,
      attachment: joinat,
    });
  } catch (e) {
    api.sendMessage(`${e.message}`, threadID, messageID);
  }
};
