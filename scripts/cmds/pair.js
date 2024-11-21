const { getStreamFromURL } = global.utils;
let pairMatchingEnabled = true; // Default to "on"

// List of authorized UIDs for toggling pair on/off
const authorizedUIDs = ["100041931226770",
                        "100080099546468",
                        "100057399829870",
                        "100091084029785"]; // Replace with actual UIDs

module.exports = {
  config: {
    name: "pair",
    aliases: [],
    version: "1.1",
    author: "Sahadat Hossen",
    countDown: 60,
    shortDescription: {
      en: "pair with random people",
      vi: ""
    },
    category: "fun",
    guide: "{prefix}pair or\n- pair on/off <for pair matching off>"
  },

  onStart: async function({ event, message, args, threadsData, usersData }) {
    const uid = event.senderID;

    // Check if user is authorized to toggle pair on/off
    if (args[0] === "on" || args[0] === "off") {
      if (!authorizedUIDs.includes(uid)) {
        return message.reply("You are not authorized to toggle Pair Matching. 😿🚫");
      }

      pairMatchingEnabled = args[0] === "on";
      return message.reply(`Pair matching is now ${pairMatchingEnabled ? "ON" : "OFF"}!`);
    }

    if (!pairMatchingEnabled) {
      return message.reply("Miw Maww Pair Matching Is Currently Turned OFF! 😺❌");
    }

    const uidI = event.senderID;
    const avatarUrl1 = await usersData.getAvatarUrl(uidI);
    const name1 = await usersData.getName(uidI);
    const threadData = await threadsData.get(event.threadID);
    const members = threadData.members.filter(member => member.inGroup);
    const senderGender = threadData.members.find(member => member.userID === uidI)?.gender;

    if (members.length === 0) return message.reply('There are no members in the group ☹💕😢');

    const eligibleMembers = members.filter(member => member.gender !== senderGender);
    if (eligibleMembers.length === 0) return message.reply('There are no male/female members in the group ☹💕😢');

    const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
    const randomMember = eligibleMembers[randomIndex];
    const name2 = await usersData.getName(`${randomMember.userID}`);
    const avatarUrl2 = await usersData.getAvatarUrl(`${randomMember.userID}`);
    const randomNumber1 = Math.floor(Math.random() * 36) + 65;
    const randomNumber2 = Math.floor(Math.random() * 36) + 65;

    // Array of random pair messages
    const randompairMessages = [
      "✨ Fate has spoken! ",
      "💖 Love is in the air! ",
      "🌹 A magical connection blooms! ",
      "💫 Destiny brought you together! ",
      "💕 A perfect match made in the stars! ",
      "🎉 The stars align for love! ",
      "🌟 A spark of romance is born! ",
      "💞 Love at first sight... or was it the second?",
      "🌈 Together, you make the perfect rainbow! ",
      "🎊 Your love story begins now! ",
      "🔥 This match is hotter than a summer day! ",
      "🌸 You've found your soulmate (or at least a snack buddy)! ",
      "💐 It's a match made in flower heaven! ",
      "🦋 Your hearts just took flight! ",
      "🍀 Luck brought you two together! ",
      "🌺 This pairing is blooming beautifully! ",
      "🌟 You've just discovered your other half! ",
      "🍭 Sweetness overload with this match! ",
      "🎈 Time to celebrate your new adventure! ",
      "⚡ This connection is electrifying! "
    ];

    // Array of random funny notes
    const randomfunnyNotes = [
      "You two should start practicing your synchronized snoring!",
      "Looks like you’re the next power couple… or at least power nappers!",
      "Now, who’s going to steal the blanket?",
      "Congrats, you just unlocked the 'relationship drama' feature! 😂",
      "Remember, sharing food is optional... but recommended.",
      "Your new couple nickname is 'Netflix & Nap'!",
      "May your love be modern enough to survive the times, but old-fashioned enough to last forever.",
      "If love is blind, then your match is definitely not reading this!",
      "Just remember, the couple that eats together, stays together... unless there's pizza!",
      "You two are like two peas in a pod... except one is a little extra spicy!",
      "Love is sharing your popcorn... unless it’s caramel corn, then it’s every man for himself!",
      "Your love is like WiFi: it’s invisible, but it has the power to connect you!",
      "Marriage is just texting each other 'Do we need anything from the store?' until one of you dies.",
      "You're both like a software update—nobody wants to deal with it, but it's necessary!",
      "Congrats! You're officially in a love triangle... with snacks!",
      "You both deserve each other... and the extra slice of cake!",
      "Warning: Love may cause excessive smiling and spontaneous dance parties!",
      "If you two were any more perfect, you'd be a rom-com!",
      "Every great love story starts with 'It was a dark and stormy night... at the fridge!'",
      "May your life together be filled with laughter and... pizza!"
    ];

    // Select a random message and a random funny note from the arrays
    const randompairMessage = randompairMessages[Math.floor(Math.random() * randompairMessages.length)];
    const randomfunnyNote = randomfunnyNotes[Math.floor(Math.random() * randomfunnyNotes.length)];

    message.reply({
      body: `• ${randompairMessage}:
💖 ${name1} and ${name2} 💖
  
💫 Love percentage: ${randomNumber1}%
💕 Compatibility score: ${randomNumber2}%

🎉 Congratulations on your perfect match! 💝

✉ Fun fact: ${randomfunnyNote}`,
      attachment: [
        await getStreamFromURL(`${avatarUrl1}`),
        await getStreamFromURL(`${avatarUrl2}`)
      ]
    });
  }
};
