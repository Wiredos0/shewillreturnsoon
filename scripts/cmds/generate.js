const axios = require('axios');

module.exports = {
  config: {
    name: "generate",
    aliases: ["gen"],
    author: "NZ R",
    countDown: 60,
    category: "Image",
    guide: {
      en: "Use the command followed by a description to generate an image. E.g., imagine a futuristic cityscape"
    },
  },
  onStart: async ({ message: { reply: r, unsend }, args: a }) => {
    if (a.length === 0) {
      return r("IMAGINE GENERATOR USAGE\n\n" + module.exports.config.guide.en);
    }

    let pr = a.join(" ");
    if (!pr) return r("Please provide a query for image generation.");

    const requestStartTime = Date.now(); 
    const waitingMessage = await r("⏳ Generating images... Please wait...");
    const waitingMessageID = waitingMessage.messageID; 

    try {
      const imageURLs = Array(4).fill().map((_, index) => 
        `https://imagine-v2-by-nzr-meta.onrender.com/generate?prompt=${encodeURIComponent(pr)}&variation=${index + 1}`
      );

      const generationStartTime = Date.now(); 

      const imageResponses = await Promise.all(
        imageURLs.map(url => axios({
          url: url,
          method: 'GET',
          responseType: 'stream'
        }))
      );

      const attachments = imageResponses.map(response => response.data);

      const generatorTime = ((Date.now() - generationStartTime) / 1000).toFixed(2);
      unsend(waitingMessageID);

      const totalTime = ((Date.now() - requestStartTime) / 1000).toFixed(2); 

      r({
        body: `✅ | Imagine AI Images Generated\n• Images Generated in: ${generatorTime} seconds\n`,
        attachment: attachments
      });

    } catch (err) {
      unsend(waitingMessageID);
      r(`❌ | Error: ${err.message}`);
    }
  }
};
