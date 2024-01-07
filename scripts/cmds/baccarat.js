module.exports = {
  config: {
    name: "baccarat",
    version: "1.0",
    author: "YourAuthorName",
    shortDescription: {
      en: "Baccarat game",
    },
    longDescription: {
      en: "Play Baccarat game.",
    },
    category: "Game",
  },
  langs: {
    en: {
      invalid_amount: "Invalid amount. Please enter a positive number.",
      baccarat_message: "Player hand: %1\nBanker hand: %2\nResult: %3\nWinnings: $%4",
    },
  },
  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

    const betAmount = parseInt(args[0]);

    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (betAmount > userData.money) {
      return message.reply("Not enough money to place the bet.");
    }

    const playerHand = drawCard() + drawCard();
    const bankerHand = drawCard() + drawCard();

    const result = determineWinner(playerHand, bankerHand);
    const winnings = calculateWinnings(result, betAmount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    const messageText = getLang("baccarat_message", playerHand, bankerHand, result, winnings);
    return message.reply(messageText);
  },
};

// Helper function to draw a card (returns a random number between 1 and 9)
function drawCard() {
  return Math.floor(Math.random() * 9) + 1;
}

// Helper function to determine the winner based on Baccarat rules
function determineWinner(playerHand, bankerHand) {
  if (playerHand > bankerHand) {
    return "Player wins!";
  } else if (playerHand < bankerHand) {
    return "Banker wins!";
  } else {
    return "It's a tie!";
  }
}

// Helper function to calculate winnings based on the game result
function calculateWinnings(result, betAmount) {
  if (result.includes("Player")) {
    return betAmount * 2; // Assuming even money for Player win
  } else if (result.includes("Banker")) {
    return betAmount * 2; // Assuming even money for Banker win
  } else {
    return betAmount; // Player and Banker tie, so the player gets back their bet
  }
}