module.exports = {
  config: {
    name: "slot",
    version: "1.2",
    author: "Abdul Kaiyum",
    shortDescription: {
      en: "Slot game",
    },
    longDescription: {
      en: "Slot game.",
    },
    category: "Game",
  },
  langs: {
    en: {
      invalid_amount: "Enter a valid and positive amount to have a chance to win double",
      not_enough_money: "Duroo mia dure jaw jaiga jomi bikre koro ga🥱 , TK nai ayshe slot khalbo ",
      spin_message: "Spinning...",
      win_message: "Ar koto khalban to borolok'ss to hoiajaitacho $%1, !",
      lose_message: "You lost $%1, thak kanna koiro na 🐸.",
      jackpot_message: "Jackpot! Miste nia aysho 💗You won $%1 with three %2 symbols, buddy!",
    },
  },
  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      return message.reply(getLang("not_enough_money"));
    }

    const fruitEmojis = ["🍒", "🍇", "🍊", "🍉", "🍎", "🍓", "🍏", "🍌"];

    // Adjusted winning probabilities
    const isSlotWin = Math.random() < 0.2;  // 50% chance of winning
    const isSlot2Win = Math.random() < 0.4;  // 40% chance of winning
    const isSlot3Win = Math.random() < 0.1;  // 30% chance of winning

    const slot1 = isSlotWin ? "🍒" : fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
    const slot2 = isSlot2Win ? "🍒" : fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
    const slot3 = isSlot3Win ? "🍒" : fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, getLang);

    return message.reply(messageText);
  },
};

function calculateWinnings(slot1, slot2, slot3, betAmount) {
  if (slot1 === "🍒" && slot2 === "🍒" && slot3 === "🍒") {
    return betAmount * 5;  // Jackpot winner gets 4 times the money
  } else if (slot1 === "🍇" && slot2 === "🍇" && slot3 === "🍇") {
    return betAmount * 3.5;  // Reduce the multiplier
  } else if (slot1 === slot2 && slot2 === slot3) {
    return betAmount * 2.83;  // Reduce the multiplier
  } else if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
    return betAmount * 2.2;  // Reduce the multiplier
  } else {
    return -betAmount;
  }
}

function getSpinResultMessage(slot1, slot2, slot3, winnings, getLang) {
  if (winnings > 0) {
    if (slot1 === "🍓" && slot2 === "🍓" && slot3 === "🍓") {
      return getLang("jackpot_message", winnings, "🍓");
    } else {
      return getLang("win_message", winnings) + ` [ ${slot1} | ${slot2} | ${slot3} ]`;
    }
  } else {
    return getLang("lose_message", -winnings) + ` [ ${slot1} | ${slot2} | ${slot3} ]`;
  }
}