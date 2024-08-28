const axios = require('axios');
const fs = require('fs');
const path = require('path');

const loveCalculator = {
  getRandomPercentage: () => Math.floor(Math.random() * 101),

  getLoveComment: async (percentage) => {
    if (percentage < 10) {
      return {
        comment: "It's better to find another partner☺",
        gifLink: "https://i.imgur.com/l74sepy.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1CYTTaxQIMIdXXdYFO6UN1ShdQiasaUX9"
      };
    } else if (percentage < 20) {
      return {
        comment: "The chance of success is very low 💔",
        gifLink: "https://i.imgur.com/GdgW1fm.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1BN_FCS8hNqrg4vgq7mso9zPlR5RW0JD7"
      };
    } else if (percentage < 30) {
      return {
        comment: "Very low chance.\nYou both have to work on it 💐",
        gifLink: "https://i.imgur.com/2oLW6ow.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1RiIqz4YwL9xbcoGa5svtFsGpmewEaCj0"
      };
    } else if (percentage < 40) {
      return {
        comment: "Not bad, give your\nbest to make it a success 💝",
        gifLink: "https://i.imgur.com/rqGLgqm.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1eycxUA5jDZB_LSheX0kkZU-pwE7o1TbM"
      };
    } else if (percentage < 50) {
      return {
        comment: "You two will be a fine couple\nbut not perfect 😔💟",
        gifLink: "https://i.imgur.com/6wAxorq.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1P83CMEWiZ08eMr6G5kMyBZ7DYlljMWac"
      };
    } else if (percentage < 60) {
      return {
        comment: "You two have some potential.\nKeep working on it! 💏",
        gifLink: "https://i.imgur.com/ceDO779.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1_RjvyfAbJEQc5M9v-2_9lEuczp5I5nFy"
      };
    } else if (percentage < 70) {
      return {
        comment: "You two will be a nice couple 💑",
        gifLink: "https://i.imgur.com/pGuGuC0.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1AkwiVnY7kpHTwLKi0hZv4jT19UKc5x4C"
      };
    } else if (percentage < 80) {
      return {
        comment: "If you two keep loving each other\nor confess your feelings,\nit might make some good changes 👩‍❤‍💋‍👨",
        gifLink: "https://i.imgur.com/bt77RPY.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1jGiEvE6namRCfMU2IEOU7bFzFX5QrSGu"
      };
    } else if (percentage < 90) {
      return {
        comment: "Perfect match!\nYour love is meant to be! 💑",
        gifLink: "https://i.imgur.com/kXNlsFf.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1kx4HkDM-SBF2h62Na_gHTmow653zL0nm"
      };
    } else {
      return {
        comment: "Amazing perfectly matched!\nYou two are meant to be for each other.\nBest wishes for your future! 👩‍❤‍💋‍👨💐",
        gifLink: "https://i.imgur.com/sY03YzC.gif",
        audioLink: "https://drive.google.com/uc?export=download&id=1NNML3BkFOWuRodg2VBsgQNfV_pgSDa1I"
      };
    }
  },

  downloadGif: async (gifLink, localPath) => {
    const response = await axios.get(gifLink, { responseType: 'arraybuffer' });
    fs.writeFileSync(localPath, Buffer.from(response.data, 'binary'));
  },

  downloadAudio: async (audioLink, localPath) => {
    const response = await axios.get(audioLink, { responseType: 'arraybuffer' });
    fs.writeFileSync(localPath, Buffer.from(response.data, 'binary'));
  },

  run: async ({ api, event, threadsData, usersData }) => {
    const senderID = event.senderID;
    const threadData = await threadsData.get(event.threadID);
    const members = threadData.members.filter(member => member.inGroup);

   
    const senderGender = threadData.members.find(member => member.userID === senderID)?.gender;
    const oppositeGenderMembers = members.filter(member => member.gender !== senderGender && member.userID !== senderID);

    if (oppositeGenderMembers.length === 0) {
      return api.sendMessage("No members of the opposite gender are available for pairing in this group. ☹", event.threadID, event.messageID);
    }

    
    const randomIndex = Math.floor(Math.random() * oppositeGenderMembers.length);
    const randomMember = oppositeGenderMembers[randomIndex];
    const lovePercentage = loveCalculator.getRandomPercentage();
    const { comment, gifLink, audioLink } = await loveCalculator.getLoveComment(lovePercentage);

    const gifPath = path.join(__dirname, 'cache', 'downloaded.gif');
    const audioPath = path.join(__dirname, 'cache', 'downloaded.mp3');

    setTimeout(async () => {
      await loveCalculator.downloadGif(gifLink, gifPath);

      const message = `${await usersData.getName(senderID)} 🤍 ${randomMember.name}\n𝗟𝗼𝘃𝗲 𝗽𝗲𝗿𝗰𝗲𝗻𝘁𝗮𝗴𝗲: ${lovePercentage}%\n${comment}`;
      const gifReadStream = fs.createReadStream(gifPath);
      api.sendMessage({ body: message, attachment: gifReadStream }, event.threadID, event.messageID);

      await loveCalculator.downloadAudio(audioLink, audioPath);

      const audioReadStream = fs.createReadStream(audioPath);
      api.sendMessage({ body: "", attachment: audioReadStream }, event.threadID);
    }, 1);
  },
};

module.exports = {
  config: {
    name: "love",
    aliases: [],
    author: "Vex_kshitiz | NZ R",
    version: "2.0",
    cooldowns: 60,
    role: 0,
    shortDescription: {
      en: "Calculate love percentage with a member of the opposite gender 💕",
    },
    longDescription: {
      en: "Calculate love percentage between you and a randomly selected member of the opposite gender, with a comment, gif, and audio.",
    },
    category: "fun",
    guide: "{prefix}love",
  },
  onStart: loveCalculator.run,
};
