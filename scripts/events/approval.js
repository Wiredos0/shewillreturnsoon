const fs = require('fs');
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "approval",
    version: "1.0",
    author: "Ohio03 | @tu33rtle.xy",
    category: "events"
  },
  onStart: async function ({ api, event, threadsData, message }) {
    const uid = "100041931226770";
    const groupId = event.threadID;
    const threadData = await threadsData.get(groupId);
    const name = threadData.threadName;
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);    

    let threads = [];
    try {
      threads = JSON.parse(fs.readFileSync('threads.json'));
    } catch (err) {
      console.error('', err);
    }

    if (!threads.includes(groupId) && event.logMessageType === "log:subscribe") {
      await message.send({
        body: `❎ | Mioww Meaoww You Added The CaT Araa Without Permission !!\n\n✧The Bot Is Now Private, If Anyone Wants To Use This Bot Then You Can Join Our Support Zone There You Can Use This Bot\nFor Join Support Zone Click Here 🔽:\n\nhttps://m.me/j/AbayMeJpqPRwgEG2`,
        attachment: await getStreamFromURL("https://tinyurl.com/279xq5u7")
      });
    }

    if (!threads.includes(groupId) && event.logMessageType === "log:subscribe") {
      await new Promise((resolve) => setTimeout(resolve, 30000)); // Delay of 1 seconds
      await api.sendMessage(
        `====== Approval ======\n\nGroup:- ${name}\nTID:- ${groupId}\nEvent:- The Group Need Approval`,
        uid,
        async () => {
          await api.removeUserFromGroup(api.getCurrentUserID(), groupId);
        }
      );
    }
  }
};
