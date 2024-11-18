const axios = require("axios");
const fs = require("fs");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "ytb",
    version: "1.2.0",
    aliases: [],
    author: "Sahadat Hossen",
    countDown: 60,
    role: 0,
    description: {
      en: "Download audio or video from YouTube"
    },
    category: "media",
    guide: {
      en: `{pn} [video|-v] [<video name>|<video link>]: Download video from YouTube\n   {pn} [audio|-a] [<video name>|<video link>]: Download audio from YouTube\n\n   Example:\n    {pn} -v Fallen Kingdom\n    {pn} -a Fallen Kingdom`
    }
  },
  onStart: async ({ api, args, event, commandName, message }) => {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    let videoID;
    const mode = args[0]; // -a or -v
    if (!["-a", "audio", "-v", "video"].includes(mode)) {
      return api.sendMessage("Please specify '-a' for audio or '-v' for video.", event.threadID, event.messageID);
    }
    args.shift(); // Remove mode from arguments
    const urlYtb = checkurl.test(args[0]);
    if (urlYtb) {
      const match = args[0].match(checkurl);
      videoID = match ? match[1] : null;
      const format = ["-a", "audio"].includes(mode) ? "mp3" : "mp4";
      try {
        const { data: { title, downloadLink, quality } } = await axios.get(
          `${await baseApiUrl()}/ytDl3?link=${videoID}&format=${format}`
        );
        return api.sendMessage(
          {
            body: `• Title: ${title}\n• Quality: ${quality || "N/A"}`,
            attachment: await dipto(downloadLink, `output.${format}`)
          },
          event.threadID,
          () => fs.unlinkSync(`output.${format}`),
          event.messageID
        );
      } catch (err) {
        return api.sendMessage("❌ Error occurred: " + err.message, event.threadID, event.messageID);
      }
    }
    let keyWord = args.join(" ");
    keyWord = keyWord.includes("?feature=share") ? keyWord.replace("?feature=share", "") : keyWord;
    const maxResults = 6;
    let result;
    try {
      result = (
        (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${keyWord}`)).data
      ).slice(0, maxResults);
    } catch (err) {
      return api.sendMessage("❌ Error occurred: " + err.message, event.threadID, event.messageID);
    }
    if (result.length == 0)
      return api.sendMessage(
        "⭕ No search results match the keyword: " + keyWord,
        event.threadID,
        event.messageID
      );
    let msg = "";
    let i = 1;
    const thumbnails = [];
    for (const info of result) {
      thumbnails.push(diptoSt(info.thumbnail, "photo.jpg"));
      msg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
    }
    api.sendMessage(
      {
        body: msg + "Reply to this message with a number to download.",
        attachment: await Promise.all(thumbnails)
      },
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
          mode,
          result
        });
      },
      event.messageID
    );
  },
  onReply: async ({ event, api, Reply }) => {
    try {
      const { result, mode } = Reply;
      const choice = parseInt(event.body);
      if (!isNaN(choice) && choice <= result.length && choice > 0) {
        const infoChoice = result[choice - 1];
        const idvideo = infoChoice.id;
        const format = ["-a", "audio"].includes(mode) ? "mp3" : "mp4";
        const { data: { title, downloadLink, quality } } = await axios.get(
          `${await baseApiUrl()}/ytDl3?link=${idvideo}&format=${format}`
        );
        await api.unsendMessage(Reply.messageID);
        await api.sendMessage(
          {
            body: `• Title: ${title}\n• Quality: ${quality || "N/A"}`,
            attachment: await dipto(downloadLink, `output.${format}`)
          },
          event.threadID,
          () => fs.unlinkSync(`output.${format}`),
          event.messageID
        );
      } else {
        api.sendMessage(
          "Invalid choice. Please enter a number between 1 and 6.",
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      console.log(error);
      api.sendMessage("⭕ Error occurred: " + error.message, event.threadID, event.messageID);
    }
  }
};

async function dipto(url, pathName) {
  try {
    const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathName, Buffer.from(response));
    return fs.createReadStream(pathName);
  } catch (err) {
    throw err;
  }
}

async function diptoSt(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    response.data.path = pathName;
    return response.data;
  } catch (err) {
    throw err;
  }
}
