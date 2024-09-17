const axios = require("axios");
const { sendMessage, editMessage, getMessageById } = require('@line/bot-sdk');

const baseApiUrl = async () => {
  try {
    const base = await axios.get('https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json');
    return base.data.api;
  } catch (error) {
    console.error("Error fetching base API URL:", error);
    throw error;
  }
};

const sendSearchingMessage = async (api, event) => {
  try {
    const message = await api.sendMessage("⏳ Searching...", event.threadID);
    return message.messageID; // Return the message ID
  } catch (error) {
    console.error("Error sending 'Searching' message:", error);
    throw error;
  }
};

const updateMessageWithLyrics = async (api, messageID, title, artist, lyrics) => {
  try {
    const songMessage = `❏ 𝐒𝐨𝐧𝐠 𝐓𝐢𝐭𝐥𝐞: ${title}\n\n❏ 𝐀𝐫𝐭𝐢𝐬𝐭: ${artist}\n\n❏ 𝐒𝐨𝐧𝐠 𝐋𝐲𝐫𝐢𝐜𝐬:\n${lyrics}`;
    await api.editMessage(songMessage, messageID);
    console.log("Lyrics message updated successfully.");
  } catch (error) {
    console.error("Error updating lyrics message:", error);
  }
};

const sendImageMessage = async (api, event, image) => {
  try {
    const stream = await axios.get(image, { responseType: 'stream' });
    await api.sendMessage({ body: "", attachment: stream.data }, event.threadID);
    console.log("Image sent successfully.");
  } catch (error) {
    console.error("Error sending image message:", error);
  }
};

module.exports = {
  config: {
    name: "lyrics",
    version: "1.0",
    author: "Nazrul & modified by Sahadat Hossen",
    countDown: 15,
    role: 0,
    description: {
      en: "Get song lyrics with their Images"
    },
    category: "Music",
    guide: {
      en: "{pn} <song name>"
    }
  },

  onStart: async ({ api, event, args }) => {
    try {
      const Songs = args.join(' ');
      if (!Songs) {
        return api.sendMessage("Please provide a song name!", event.threadID);
      }

      // Send the initial "⏳ Searching..." message and get the message ID
      const searchingMessageID = await sendSearchingMessage(api, event);

      // Fetch base API URL
      const apiUrl = await baseApiUrl();
      console.log("Base API URL fetched:", apiUrl);

      // Fetch lyrics data
      const res = await axios.get(`${apiUrl}/lyrics2?songName=${encodeURIComponent(Songs)}`);
      const data = res.data;

      console.log("Fetched data:", data);

      if (!data.title || !data.artist || !data.lyrics) {
        console.error("Invalid data format received:", data);
        await api.editMessage("An error occurred while fetching lyrics!", searchingMessageID);
        return;
      }

      // Update the "Searching..." message with the lyrics
      await updateMessageWithLyrics(api, searchingMessageID, data.title, data.artist, data.lyrics);

      // Send the image if available
      if (data.image) {
        await sendImageMessage(api, event, data.image);
      } else {
        console.log("No image found for this song.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      try {
        await api.sendMessage("Error: " + error.message, event.threadID);
      } catch (getMsgError) {
        console.error("Error sending error message:", getMsgError);
      }
    }
  }
};
