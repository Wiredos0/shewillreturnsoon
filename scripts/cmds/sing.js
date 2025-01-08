const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'sing',
    aliases:["song","play"],
    version: '1.9.0',
    author: 'NZ R',
    countDown: 60,
    role: 0,
    description: {
      en: '🎶 Search and download songs with audio recognition.',
    },
    category: 'media',
    guide: {
      en: '{pn} <song name> or reply to an audio/video: Search and download audio from YouTube.',
    },
  },
  onStart: async ({ api, args, event, commandName, message }) => {
    let songName, tempMessageID;

    try {
      if (event.messageReply && event.messageReply.attachments.length > 0) {
        tempMessageID = (await api.sendMessage('🔍 Recognizing audio... This might take a few moments. Please wait... ⏳', event.threadID)).messageID;

        const attachment = event.messageReply.attachments[0];
        if (attachment.type === 'video' || attachment.type === 'audio') {
          const audioUrl = attachment.url;
          const recognitionResponse = await axios.get(`https://audio-recon-ahcw.onrender.com/kshitiz?url=${encodeURIComponent(audioUrl)}`);
          songName = recognitionResponse.data.title;

          if (!songName) {
            throw new Error('Music recognition failed.');
          }
        } else {
          throw new Error('Invalid attachment type.');
        }
      } else if (args.length > 0) {
        songName = args.join(' ');
      } else {
        return message.reply('⚠ Please provide a song name or reply to an audio/video attachment.');
      }

      const searchResponse = await axios.get(`https://ytdl-v3-by-nzr.onrender.com/search?name=${encodeURIComponent(songName)}`);
      const songResults = searchResponse.data.results.slice(0, 6);

      if (songResults.length === 0) {
        return message.reply('❌ No results found. Please try a different query.');
      }

      if (tempMessageID) {
        api.unsendMessage(tempMessageID);
      }

      let responseMessage = '🎵 Here are your song suggestions:\n\n';
      const thumbnails = await Promise.all(
        songResults.map((result, index) => downloadThumbnail(result.thumbnail, `thumb_${index}.jpg`))
      );

      for (let i = 0; i < songResults.length; i++) {
        const song = songResults[i];
        responseMessage += `${i + 1}. ${song.title}\nDuration: ${song.timestamp}\n\n`;
      }

      const thumbnailStreams = thumbnails.map((thumb) => fs.createReadStream(thumb.path));
      message.reply(
        {
          body: `${responseMessage}Reply with the number to download your choice. 🎧`,
          attachment: thumbnailStreams,
        },
        (err, sentMessage) => {
          if (err) return console.error(err);

          global.GoatBot.onReply.set(sentMessage.messageID, {
            commandName,
            messageID: sentMessage.messageID,
            author: event.senderID,
            videos: songResults,
          });

          thumbnails.forEach((thumb) => fs.unlinkSync(thumb.path));
        }
      );
    } catch (error) {
      console.error('Error:', error);
      if (tempMessageID) api.unsendMessage(tempMessageID);
      message.reply('🚫 An error occurred. Please try again.');
    }
  },
  onReply: async ({ event, api, Reply }) => {
    const { videos } = Reply;
    const choice = parseInt(event.body);

    if (isNaN(choice) || choice < 1 || choice > videos.length) {
      return api.sendMessage('⚠ Invalid choice. Please choose a number between 1 and 6.', event.threadID);
    }

    try {
      const selectedVideo = videos[choice - 1];
      const downloadUrl = `https://ytdl-v3-by-nzr.onrender.com/mp3?url=${selectedVideo.url}`;
      const downloadResponse = await axios.get(downloadUrl);
      const { link, title } = downloadResponse.data.data;
      const fileName = `${title}.mp3`;

      await downloadFile(link, fileName);
      api.unsendMessage(Reply.messageID);

      await api.sendMessage(
        {
          body: `🎶 Here is your song:\nTitle: ${title}\nDuration: ${selectedVideo.timestamp}`,
          attachment: fs.createReadStream(fileName),
        },
        event.threadID,
        () => {
          fs.unlinkSync(fileName);
        }
      );
    } catch (error) {
      console.error('Download Error:', error);
      api.sendMessage('🚫 An error occurred while downloading. Please try again.', event.threadID);
    }
  },
};

async function downloadFile(url, outputPath) {
  try {
    const response = await axios({ url, method: 'GET', responseType: 'arraybuffer' });
    fs.writeFileSync(outputPath, Buffer.from(response.data));
    return fs.createReadStream(outputPath);
  } catch (error) {
    console.error('File Download Error:', error);
    throw error;
  }
}

async function downloadThumbnail(url, outputPath) {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writeStream = fs.createWriteStream(outputPath);

    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve({ path: outputPath }));
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error('Thumbnail Download Error:', error);
    throw error;
  }
          }
