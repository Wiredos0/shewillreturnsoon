const axios = require('axios');

module.exports = {
  config: {
    name: "cax",
    aliases: ["cx"],
    version: "1.0",
    author: "Sahadat Hossen",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "AI",
    guide: "{pn} question"
  },

  onStart: async function ({ message, event, args, commandName, usersData, api }) {
    const userID = event.senderID;
    const prompt = args.join(' ');

    // Fetch user balance
    const userData = await usersData.get(userID);
    const userMoney = userData?.money ?? 0;

    // Check if user has enough balance
    if (userMoney < 50) {
      return api.sendMessage(
        "- You don't have enough balance to use this command!\n- This command costs $50 to every single question! \n- Check your bot balance by typing `-bal`.\n-To earn balance, you can play games or claim daily rewards by typing -daily.\n\n- Available games to play are -quiz and -scramble.",
        event.threadID, event.messageID
      );
    }

    try {
      const response = await axios.get("https://milanbhandari.onrender.com/infra", {
        params: {
          query: prompt
        }
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const replyMessage = response.data.choices[0].message.content;

        // Deduct the balance if everything is successful
        await usersData.set(userID, {
          money: userMoney - 50,
          data: userData.data
        });

        await sendResponseWithTTS(message, replyMessage, (err, info) => {
          if (err) {
            console.error("Error sending reply:", err);
            return;
          }
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID
          });
        });
      } else {
        console.error("Invalid response structure or no message content.");
      }
    } catch (error) {
      console.error("Error fetching response:", error.message);
    }
  },

  onReply: async function ({ message, event, Reply, args, usersData, api }) {
    const { author, commandName } = Reply;
    if (event.senderID !== author) return;

    const prompt = args.join(' ');
    const { senderID, threadID, messageID } = event;

    // Fetch user balance again during reply handling
    const userData = await usersData.get(senderID);
    const userMoney = userData?.money ?? 0;

    // Double-check balance again in the reply handler to prevent bypass
    if (userMoney < 50) {
      return api.sendMessage(
        "- You don't have enough balance to use this command again\n- This command costs $50 to every single question.\n- Check your bot balance by typing `-bal`\n- To earn balance, you can play games or claim daily rewards by typing -daily.\n\n- Available games to play are -quiz and -scramble.",
        threadID, messageID
      );
    }

    try {
      const response = await axios.get("https://milanbhandari.onrender.com/infra", {
        params: {
          query: prompt
        }
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const replyMessage = response.data.choices[0].message.content;

        // Deduct the balance again to ensure it updates during reply handling
        await usersData.set(senderID, {
          money: userMoney - 50,
          data: userData.data
        });

        await sendResponseWithTTS(message, replyMessage, (err, info) => {
          if (err) {
            console.error("Error sending reply:", err);
            return;
          }

          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID
          });
        });
      } else {
        console.error("Invalid response structure or no message content.");
      }
    } catch (error) {
      console.error("Error handling reply:", error.message);
    }
  }
};

// Helper function to send a response with optional TTS
async function sendResponseWithTTS(message, text, callback) {
  try {
    const ttsAttachment = await getTTSLink(text);
    if (ttsAttachment) {
      message.reply({
        body: text,
        attachment: ttsAttachment
      }, callback);
    } else {
      // Fallback to text-only if TTS link is not available
      message.reply({ body: text }, callback);
    }
  } catch (error) {
    console.error("Error sending response with TTS:", error.message);
    // Fallback to sending just the text if TTS generation fails
    message.reply({ body: text }, callback);
  }
}

// Helper function to get TTS link
async function getTTSLink(text) {
  try {
    const link = `https://sandipbaruwal.onrender.com/beast?text=${encodeURIComponent(text)}`;
    return await global.utils.getStreamFromURL(link); // Fetch the TTS stream
  } catch (error) {
    console.error("Error generating TTS:", error.message);
    return null; // Return null if TTS fails
  }
}
