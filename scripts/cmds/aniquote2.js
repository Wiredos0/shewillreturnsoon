module.exports = {
config: {
name: "aniquote2",
aliases: ["quote"],
version: "1.0",
author: "Strawhat Luffy",
countDown: 13,
role: 2,
shortDescription: "get random quotes",
longDescription: "Get random anime quotes videos from different anime",
category: "anime",
guide: "{p}{n}",
},

aniquote: [],

onStart: async function ({ api, event, message }) {
const senderID = event.senderID;

const loadingMessage = await message.reply({
body: " Your command is loding😚, please wait♥🦊",
});

const link = [
"https://drive.google.com/uc?export=download&id=1-FamZdrMAcbJQqtFpE-JPf8L9mgGQ44w",
 
  "https://drive.google.com/uc?export=download&id=1-Pb-xaaIwx6LjaBJawSov4QDEAX5SnLF",

  "https://drive.google.com/uc?export=download&id=1-KDTfAPKinLNwS0xIz08psTtW9hnmeXR",

  "https://drive.google.com/uc?export=download&id=1-7DL0NdTpf6wlFOE9Muo6ZyuLUMYgEoz",

  "https://drive.google.com/uc?export=download&id=1-AfOV9cfPVMlrgPbzhsE_q-ny2tE3d7O",

  "https://drive.google.com/uc?export=download&id=1-MXhJURqdcEbOE9IWY8TpKDg-IVeTyZ6",

];

const availableVideos = link.filter(video => !this.aniquote.includes(video));

if (availableVideos.length === 0) {
this.aniquote = [];
}

const randomIndex = Math.floor(Math.random() * availableVideos.length);
const randomVideo = availableVideos[randomIndex];

this.aniquote.push(randomVideo);

if (senderID !== null) {
message.reply({
body: 'Enjoy😚....!!',
attachment: await global.utils.getStreamFromURL(randomVideo),
});

setTimeout(() => {
api.unsendMessage(loadingMessage.messageID);
}, 50000);
}
},
};