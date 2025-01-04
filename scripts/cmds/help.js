const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.18",
    author: "Sahadat Hossen",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Xem cách dùng lệnh",
      en: "View command usage"
    },
    longDescription: {
      vi: "Xem cách sử dụng của các lệnh",
      en: "View command usage"
    },
    category: "info",
    guide: {
      en: "{pn} [empty | <command name>] : View command usage"
    }
  },

  langs: {
    en: {
      footer: `
─── NAME ────⭓
» {cmdName}
─── INFO
» Author: {cmdAuthor}
» Other Names: {cmdAliases}
» Other Names in this group: {cmdSetAlias}
» Description: {cmdDesc}
─── Usage
{cmdGuide}
───────✧`,
      commandNotFound: "Command \"%1\" does not exist",
      noCategory: "NO CATEGORY",
      doNotHave: "None"
    }
  },

  onStart: async function({ message, args, event, threadsData, getLang, role }) {
    const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
    const getLangText = getLang("footer");
    const prefix = getPrefix(event.threadID);

    function toSansBold(text) {
      const sansBoldChars = {
        a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", 
        m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", 
        y: "𝘆", z: "𝘇", A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", 
        K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", 
        W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
      };
      return text.split("").map(char => sansBoldChars[char] || char).join("");
    }

    if (!args[0]) {
      // Generate command list
      let msg = "";
      const categorized = {};
      commands.forEach(cmd => {
        if (cmd.config.role <= role) {
          const category = cmd.config.category || getLang("noCategory");
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(cmd.config.name);
        }
      });

      Object.keys(categorized).forEach(category => {
        msg += `╭──『 ${toSansBold(category.toUpperCase())} 』\n✧${categorized[category].join(" ✧")}\n╰───────────◊\n`;
      });

      msg += `
╭────────────◊
│ » Total cmds: ${commands.size}.
│ » Type [ -help <cmd> ]
│   to learn the usage.
╰────────◊
         「 CaT Araa 」`;

      return message.reply(msg);
    }

    // Get command details
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));
    if (!command) return message.reply(getLang("commandNotFound", commandName));

    const cmdConfig = command.config;
    const aliasesText = cmdConfig.aliases ? cmdConfig.aliases.join(", ") : getLang("doNotHave");
    const guide = cmdConfig.guide?.en?.replace(/\{pn\}/g, prefix + cmdConfig.name) || getLang("doNotHave");

    const footer = getLangText
      .replace("{cmdName}", cmdConfig.name)
      .replace("{cmdAuthor}", cmdConfig.author || "Unknown")
      .replace("{cmdAliases}", aliasesText)
      .replace("{cmdSetAlias}", "Do not have") // Replace with group-specific aliases logic if needed
      .replace("{cmdDesc}", cmdConfig.shortDescription?.en || "No description available")
      .replace("{cmdGuide}", guide);

    return message.reply(footer);
  }
};
