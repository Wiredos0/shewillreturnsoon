const a = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
        config: {
                name: "upscaleai",
                aliases: ["4k", "upscale"],
                version: "2.0",
                author: "JARiF",
                countDown: 60,
                role: 0,
                longDescription: "Upscale your image.",
                category: "utility",
                guide: {
                        en: "{pn} reply to one or multiple images"
                }
        },

        onStart: async function ({ message, args, event, api }) {
                let imageUrls = [];

                if (event.type === "message_reply") {
                        const replyAttachments = event.messageReply.attachments;

                        replyAttachments.forEach(attachment => {
                                if (["photo", "sticker"].includes(attachment?.type)) {
                                        imageUrls.push(attachment.url);
                                }
                        });

                        if (imageUrls.length === 0) {
                                return api.sendMessage(
                                        { body: "❌ | Reply must include at least one image." },
                                        event.threadID
                                );
                        }
                } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
                        imageUrls = args;
                } else {
                        return api.sendMessage({ body: "❌ | Reply to one or multiple images." }, event.threadID);
                }

                const upscaleTime = imageUrls.length * 5; // Roughly estimate 5 seconds per image
                api.sendMessage({ body: `⏳ | Upscaling ${imageUrls.length} images. Estimated time: ${upscaleTime} seconds.` }, event.threadID);

                try {
                        const resultAttachments = [];

                        for (let imageUrl of imageUrls) {
                                const url = await tinyurl.shorten(imageUrl);
                                const k = await a.get(`https://www.api.vyturex.com/upscale?imageUrl=${url}`);
                                const resultUrl = k.data.resultUrl;

                                const stream = await global.utils.getStreamFromURL(resultUrl);
                                resultAttachments.push(stream);
                        }

                        message.reply({ body: `✅ | ${imageUrls.length} Image(s) Upscaled.`, attachment: resultAttachments });
                } catch (error) {
                        message.reply("❌ | Error: " + error.message);
                }
        }
};
