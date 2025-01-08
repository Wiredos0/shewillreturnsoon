const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const fast = require('fast-speedtest-api');
const axios = require('axios');

const imageUrl = "https://i.ibb.co/XS9Dhyj/image.jpg";
const groupId = "7155847394517785";
const imagePath = path.resolve(__dirname, 'downloaded_image.jpg');

module.exports = {
    config: {
        name: "uptime",
        aliases: ["up", "upt"],
        version: "3.0",
        author: "Sahadat Hossen",
        role: 1,
        shortDescription: { en: "Check bot's uptime and speed" },
        longDescription: { en: "Check the bot's uptime, users, threads, speed performance and media ban status" },
        category: "system",
        guide: { en: "{pn}" }
    },

    onStart: async function ({ api, event, usersData, threadsData }) {
        try {
            await downloadImage(imageUrl, imagePath);

            const totalUsers = await usersData.getAll();
            const allThreads = await threadsData.getAll();
            const uptime = process.uptime();
            const uptimeDuration = moment.duration(uptime, 'seconds');
            const hours = Math.floor(uptimeDuration.asHours());
            const minutes = uptimeDuration.minutes();
            const seconds = uptimeDuration.seconds();
            const totalUsersLength = totalUsers.length;
            const totalThreadsLength = allThreads.length;
            const pingStart = Date.now();
            const sentMessage = await api.sendMessage(this.thin("🟢 Processing..."), event.threadID);
            const pingEnd = Date.now() - pingStart;
            const pingStatus = pingEnd > 1000 ? "Bad ❎" : pingEnd > 500 ? "Medium❗" : "Good ✅";

            const speedTest = new fast({
                token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
                verbose: false,
                timeout: 10000,
                https: true,
                urlCount: 5,
                bufferSize: 8,
                unit: fast.UNITS.Mbps
            });
            const speedResult = await speedTest.getSpeed();

            const initialMessage = `
🟢 Bot Has Been Working For
- ${hours} Hr(s) ${minutes} Min(s) ${seconds} sec(s)
- Total Users: ${totalUsersLength}
- Total Threads: ${totalThreadsLength}
- Speed: ${pingEnd}ms
- Speed Status: ${pingStatus}
- IsMedia Banned: 𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴...
- Checking Internet Speed... 
            `;

            await api.editMessage(this.thin(initialMessage), sentMessage.messageID);

            setTimeout(async () => {
                const imageSent = await sendImage(api);
                const mediaBanText = imageSent ? "NO ✅" : "YES 🚫";

                const statusMessage = `
🟢 Bot Has Been Working For
- ${hours} Hr(s) ${minutes} Min(s) ${seconds} sec(s)
- Total Users: ${totalUsersLength}
- Total Threads: ${totalThreadsLength}
- Speed: ${pingEnd}ms
- Speed Status: ${pingStatus}
- IsMedia Banned: ${mediaBanText}
- ${speedResult} ᴍʙᴘꜱ
                `;

                await api.editMessage(this.thin(statusMessage), sentMessage.messageID);
            }, 3000);

        } catch (err) {
            console.error(err);
            return api.editMessage("❌ An error occurred while fetching system statistics.", sentMessage.messageID);
        }
    },

    thin: (str) => str.replace(/(?!^)(?=(?:\S{3})+$)/g, "")
};

async function downloadImage(url, path) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(fs.createWriteStream(path));
    return new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
    });
}

async function sendImage(api) {
    try {
        const attachment = fs.createReadStream(imagePath);
        await api.sendMessage({ attachment }, groupId);
        return true;
    } catch (error) {
        return false;
    }
}
