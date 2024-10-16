const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "approval",
    version: "2.0",
    author: "NZ R",
    category: "events",
    shortDescription: { en: "" },
    longDescription: { en: "" },
    guide: { en: "" }
  },
  onStart: async function ({ api, event, threadsData, message }) {
    const adminUID = "7048161018552804";
    const groupId = event.threadID;
    const threadData = await threadsData.get(groupId);
    const groupName = threadData.threadName;
    const { getPrefix } = global.utils;
    const prefix = getPrefix(event.threadID);

    let approvedThreads = [];
    try {
      approvedThreads = JSON.parse(fs.readFileSync('threads.json', 'utf8'));
    } catch (err) {
      console.error('Error reading threads.json:', err);
    }

    if (!approvedThreads.includes(groupId) && event.logMessageType === "log:subscribe") {
      let userName = '';
      try {
        const userInfo = await api.getUserInfo(event.author);
        userName = userInfo[event.author].name;
      } catch (err) {
        console.error('Error fetching user information:', err);
      }

      await message.send({
        body: `❎ | Mioww Meaoww You Added The CaT Araa Without Permission !!\n\n✧The Bot Is Now Private, If Anyone Wants To Use This Bot Then You Can Join Our Support Zone There You Nan Use This Bot\nFor Join Support Zone Click Here 🔽:\n\nhttps://m.me/j/AbayMeJpqPRwgEG2`,
        attachment: await getStreamFromURL("https://i.ibb.co/5992ZSF/421631450.jpg")
      });

      await new Promise(resolve => setTimeout(resolve, 20000));

      const approvalMessage = `====== Approval Request ======\n\nGroup: ${groupName}\nThread ID: ${groupId}\nEvent: This group requires approval for using CaT Araa.\nAdded by: ${userName}`;
      await api.sendMessage(approvalMessage, adminUID, async (err) => {
        if (err) {
          console.error('Error sending approval message to admin:', err);
          return;
        }
        await api.removeUserFromGroup(api.getCurrentUserID(), groupId);
      });
    }
  }
};
