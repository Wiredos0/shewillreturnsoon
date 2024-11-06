const axios = require('axios');

module.exports = {
  config: {
    name: "sdxl",
    author: "NZ R",
    countDown: 60,
    category: "Image",
    guide: {
      en: "Usage:\n-sdxl your prompt\n\nExample:\n-sdxl A cute cat"
    },
  },
  onStart: async ({ message: { reply: r, unsend }, args: a }) => {
    if (a.length === 0) {
      return r("SDXL IMAGE GENERATOR USAGE\n\n" + module.exports.config.guide.en);
    }

    let pr = a.join(" ");
    if (!pr) return r("Please provide a query for image generation.");

    const requestStartTime = Date.now(); 

    const waitingMessage = await r("⏳ Generating image... Please wait...");
    const waitingMessageID = waitingMessage.messageID; 

    try {
      const imageURL = `https://sdxl-v1-by-nzr.onrender.com/sdxl?prompt=${encodeURIComponent(pr)}`;

      const generationStartTime = Date.now(); 
      const response = await axios({
        url: imageURL,
        method: 'GET',
        responseType: 'stream'
      });
      const attachment = response.data;
      const generatorTime = ((Date.now() - generationStartTime) / 1000).toFixed(2);

      unsend(waitingMessageID);

      const totalTime = ((Date.now() - requestStartTime) / 1000).toFixed(2); 

      r({
        body: `✅ | AI SDXL Image Generated\n• Image Generated in: ${generatorTime} seconds\n`,
        attachment: attachment
      });

    } catch (err) {
      unsend(waitingMessageID);
      r(`❌ | Error: ${err.message}`);
    }
  }
};
