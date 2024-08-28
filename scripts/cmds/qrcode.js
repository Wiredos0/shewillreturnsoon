const qrcode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "qrcode",
        aliases: ["qrc","qr"],
        version: "1.0",
        author: "SiAM",
        countDown: 25,
        role: 0,
        shortDescription: "make QR code or Decode QR code",
        longDescription: "Bot will make you QR code based on your Text also it can decode QR code from a QR image",
        category: "Image",
        guide: {
            en: "\n{pn} make 'yourtext'\n{pn} decode (with reply to an image)"
        }
    },

    async onStart({ api, args, message, event }) {
        const command = args[0];
        const text = args.slice(1).join(" ");

        if (command === "make") {
            if (!text) {
                return message.reply("Please provide the text to encode as a QR code.");
            }

            const filePath = path.join(__dirname, `${Date.now()}.jpeg`);

            try {
                await qrcode.toFile(filePath, text);
                message.reply({
                    body: "Here's the QR code you requested: ✅",
                    attachment: fs.createReadStream(filePath),
                }, () => fs.unlinkSync(filePath));
            } catch (error) {
                console.log(error);
                message.reply("There was an error generating the QR code.");
            }
        } else if (command === "scan") {
            let imageUrl;

            if (event.type === "message_reply" && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
                imageUrl = event.messageReply.attachments[0].url;
            } else if (args[1]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
                imageUrl = args[1];
            } else {
                return message.reply("Please provide a valid image URL or reply to an image.");
            }

            const decodedText = await decodeQRCode(imageUrl);

            if (decodedText) {
                message.reply(`The decoded text from the QR code is: ✅\n\n${decodedText}`);
            } else {
                message.reply("🚫 Could not decode the QR code.");
            }
        } else {
            message.reply("Invalid input ⚠\nPlease follow:\n-qrcode make 'your text'\n-qrcode scan\n\nExample:\n-qrcode make im siam\n\nFor decode, reply to the image with:\n-qrcode scan");
        }
    }
};

async function decodeQRCode(imageUrl) {
    try {
        const image = await loadImage(imageUrl);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const code = jsQR(imageData.data, image.width, image.height);
        const decodedText = code ? code.data : null;
        return decodedText;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
