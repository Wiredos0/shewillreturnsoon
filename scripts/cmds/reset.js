let reminderInterval;

module.exports = {
  config: {
    name: "reset",
    aliases: ["rs"],
    version: "1.1",
    author: "Sheikh Farid",
    countdown: 5,
    role: 2,
    shortDescription: {
      en: "Toggle the bot's uptime reminder."
    },
    longDescription: {
      en: "Command to turn on/off the bot's uptime reminder in the BOX CHAT category."
    },
    category: "BOX CHAT",
    guide: {
      en: "Usage: rs <on/off>"
    }
  },
  langs: {
    en: {
      gg: "Uptime set!"
    }
  },
  onStart: async function ({ api, message, args, event }) {
    if (this.config.author !== "Sheikh Farid") {
      return message.reply("Don't change the credit.");
    }

    const mew = args[0];

    if (mew === 'on') {
      reminderInterval = setInterval(() => {
        message.send(`*restart`, 7130458690403208);
        setTimeout(() => {
          message.send(`*rs on`, 7130458690403208);
        }, 1 * 60 * 1000);
      }, 6 * 60 * 1000);

      message.reply(`Uptime is now ON.`, event.threadId);
    } else if (mew === 'off') {
      clearInterval(reminderInterval);
      message.reply(`Uptime is now OFF.`, event.threadId);
    } else {
      message.reply("Invalid command. Use 'on' or 'off'.");
    }
  }
};