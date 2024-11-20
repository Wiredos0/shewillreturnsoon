const axios = require("axios");
const fs = require("fs");
const yts = require("yt-search");

const baseApiUrl = async () => {
  try {
    const response = await axios.get(
      "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json"
    );
    return response.data.api;
  } catch (error) {
    throw new Error("Failed to fetch the base API URL.");
  }
};

module.exports = {
  config: {
    name: "sing",
    version: "1.1.5",
    aliases: ["song","play"],
    author: "Sahadat Hossen",
    countDown: 60,
    role: 0,
    description: {
      en: "Download audio from YouTube",
    },
    category: "media",
    guide: {
      en: "{pn} [<song name>|<song link>]:\n   Example:\n{pn} chipi chipi chapa chapa",
    },
  },
  onStart: async ({ api, args, event, message }) => {
    const youtubeRegex =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    let videoID;
    const isYoutubeURL = youtubeRegex.test(args[0]);

    if (isYoutubeURL) {
      const match = args[0].match(youtubeRegex);
      videoID = match ? match[1] : null;

      try {
        const { data: { title, downloadLink } } = await axios.get(
          `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
        );

        await api.sendMessage(
          {
            body: title,
            attachment: await downloadAudio(downloadLink, "audio.mp3"),
          },
          event.threadID,
          () => {
            fs.unlinkSync("audio.mp3");
            api.setMessageReaction("✅", event.messageID, () => {}, true);
          },
          event.messageID
        );
      } catch (error) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply("An error occurred. Please try again.");
      }
      return;
    }

    const keyword = args.join(" ").replace("?feature=share", "");
    
    // Set loading reaction while searching
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    try {
      const { videos } = await yts(keyword);
      const song = videos[0];

      if (!song) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply("No results found.");
      }

      const { videoId: id, title } = song;
      const { data: { downloadLink, quality } } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${id}&format=mp3`
      );

      await api.sendMessage(
        {
          body: `• Title: ${title}\n• Quality: ${quality}`,
          attachment: await downloadAudio(downloadLink, "audio.mp3"),
        },
        event.threadID,
        () => {
          fs.unlinkSync("audio.mp3");
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        },
        event.messageID
      );
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("An error occurred. Please try again.");
    }
  },
};

async function downloadAudio(url, filePath) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, Buffer.from(response.data));
    return fs.createReadStream(filePath);
  } catch (error) {
    throw new Error("Failed to download audio.");
  }
}
