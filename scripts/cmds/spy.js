const axios = require("axios");

module.exports = {
  config: {
    name: "spy",
    aliases: ["uinfo"],
    version: "1.0",
    role: 0,
    author: "Sahadat Hossen",
    description: "Get user information and profile photo",
    category: "box chat",
    countDown: 15,
  },

  onStart: async function ({ event, message, usersData, api, args, threadsData }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      uid =
        event.type === "message_reply"
          ? event.messageReply.senderID
          : uid2 || uid1;
    }

    // Fetch user data
    let userInfo;
    try {
      userInfo = await api.getUserInfo(uid);
    } catch (error) {
      return message.reply(`Failed to fetch user information: ${error.message}`);
    }

    const avatarUrl = await usersData.getAvatarUrl(uid);
    const threadInfo = await api.getThreadInfo(event.threadID);
    const groupNickName =
      threadInfo.nicknames && threadInfo.nicknames[uid]
        ? threadInfo.nicknames[uid]
        : "No Nickname";

    // Retrieve the total message count for the user
    const members = await threadsData.get(event.threadID, "members");
    const findMember = members.find(user => user.userID == uid);
    const messageCount = findMember ? findMember.count : 'N/A'; // Default to 'N/A' if user not found

    let genderText;
    switch (userInfo[uid].gender) {
      case 1:
        genderText = "Girl";
        break;
      case 2:
        genderText = "Boy";
        break;
      default:
        genderText = "Unknown";
    }

    const money = (await usersData.get(uid)).money;
    const allUser = await usersData.getAll();
    const rank =
      allUser
        .slice()
        .sort((a, b) => b.exp - a.exp)
        .findIndex((user) => user.userID === uid) + 1;
    const moneyRank =
      allUser
        .slice()
        .sort((a, b) => b.money - a.money)
        .findIndex((user) => user.userID === uid) + 1;

    const userInformation = `
╭───── [ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]
╰ ◈ Name: ${userInfo[uid].name}
╰ ◈ Gender: ${genderText}
╰ ◈ UID: ${uid}
╰ ◈ Profile URL: ${userInfo[uid].profileUrl}
╰ ◈ UserName: ${userInfo[uid].vanity ? userInfo[uid].vanity : "𝙽𝚘𝚗𝚎"}
╰ ◈ Group NickName: ${groupNickName}
╰ ◈ I'D NickName: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}
╰ ◈ Is Birthday today: ${userInfo[uid].isBirthday ? "YES" : "NO"}
╰ ◈ Friend With Bot: ${userInfo[uid].isFriend ? "YES" : "NO"}

╭───── [ 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐔𝐒 ]
╰ ◈ Money: $${formatMoney(money)}
╰ ◈ Rank: #${rank}/${allUser.length}
╰ ◈ Money Rank: #${moneyRank}/${allUser.length}
╰ ◈ Total Messages: ${messageCount}`;

    message.reply({
      body: userInformation,
      attachment: await global.utils.getStreamFromURL(avatarUrl),
    });
  },
};

function formatMoney(num) {
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
      }
