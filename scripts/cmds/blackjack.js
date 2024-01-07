module.exports = {
  config: {
    name: "blackjack",
    version: "1.1",
    author: "Abdul Kaiyum",
    shortDescription: {
      en: "Blackjack game",
    },
    longDescription: {
      en: "Play Blackjack game with realistic features.",
    },
    category: "Game",
  },
  langs: {
    en: {
      invalid_amount: "Invalid amount. Please enter a positive number.",
      not_enough_money: "Not enough money to place the bet.",
      blackjack_message: "Your hand: %1\nDealer's hand: %2\nResult: %3\nWinnings: $%4",
      split_message: "You chose to split. Playing two hands...",
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
      return message.reply(getLang("not_enough_money"));
    }

    // Initialize hands
    const playerHand = [drawCard(), drawCard()];
    const dealerHand = [drawCard(), drawCard()];

    // Check for split option
    if (canSplit(playerHand)) {
      message.reply(getLang("split_message"));
      return handleSplit(playerHand, dealerHand, betAmount, senderID, usersData, getLang);
    }

    // Play the game
    const result = playBlackjack(playerHand, dealerHand);

    // Calculate winnings and update user's balance
    const winnings = calculateWinnings(result, betAmount);
    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    // Send game result message
    const messageText = getLang("blackjack_message", formatHand(playerHand), formatHand(dealerHand), result, winnings);
    return message.reply(messageText);
  },
};

// Helper function to check if a hand is eligible for splitting
function canSplit(hand) {
  return hand.length === 2 && hand[0] === hand[1];
}

// Helper function to ask the user if they want to split
async function askSplitOption(message, getLang) {
  const splitOptions = ["split", "no split"];
  const splitResponse = await message.prompt(getLang("Do you want to split?"), splitOptions);
  return splitResponse.toLowerCase();
}

// Helper function to handle the splitting logic
async function handleSplit(playerHand, dealerHand, betAmount, senderID, usersData, getLang) {
  const { money } = await usersData.get(senderID);

  // Deduct additional bet for split hand
  const splitBetAmount = betAmount;
  if (splitBetAmount > money) {
    return message.reply(getLang("not_enough_money"));
  }

  // Split the hand
  const splitHand = [playerHand.pop(), drawCard()];
  playerHand.push(drawCard());

  // Play each hand separately
  const result1 = playBlackjack(playerHand, dealerHand);
  const result2 = playBlackjack(splitHand, dealerHand);

  // Calculate winnings and update user's balance
  const winnings1 = calculateWinnings(result1, betAmount);
  const winnings2 = calculateWinnings(result2, splitBetAmount);

  await usersData.set(senderID, {
    money: money + winnings1 + winnings2,
    data: userData.data,
  });

  // Send game result messages for both hands
  const messageText1 = getLang("blackjack_message", formatHand(playerHand), formatHand(dealerHand), result1, winnings1);
  const messageText2 = getLang("blackjack_message", formatHand(splitHand), formatHand(dealerHand), result2, winnings2);

  return message.reply(`${messageText1}\n\n${messageText2}`);
}

// Helper function to draw a card (returns a random number between 1 and 11)
function drawCard() {
  return Math.floor(Math.random() * 11) + 1;
}

// Helper function to format the hand for display
function formatHand(hand) {
  return hand.join(" | ");
}

// Helper function to play the Blackjack game and determine the result
function playBlackjack(playerHand, dealerHand) {
  const playerTotal = calculateHandTotal(playerHand);
  const dealerTotal = calculateHandTotal(dealerHand);

  if (playerTotal === 21) {
    return "Blackjack! You win!";
  } else if (dealerTotal === 21) {
    return "Dealer has Blackjack. You lose.";
  } else if (playerTotal > 21) {
    return "Bust! You went over 21. You lose.";
  } else if (dealerTotal > 21) {
    return "Dealer busts! You win!";
  } else if (playerTotal > dealerTotal) {
    return "You win!";
  } else if (playerTotal < dealerTotal) {
    return "You lose.";
  } else {
    return "It's a tie!";
  }
}

// Helper function to calculate the total value of a hand in Blackjack
function calculateHandTotal(hand) {
  let total = 0;
  let numAces = 0;

  for (const card of hand) {
    if (card === 1) {
      // Ace
      total += 11;
      numAces += 1;
    } else if (card > 10) {
      // Face cards
      total += 10;
    } else {
      // Number cards
      total += card;
    }
  }

  // Adjust for Aces
  while (total > 21 && numAces > 0) {
    total -= 10;
    numAces -= 1;
  }

  return total;
}

// Helper function to calculate winnings based on the game result
function calculateWinnings(result, betAmount) {
  if (result.includes("Blackjack")) {
    return betAmount * 1.5; // Blackjack usually pays 3:2
  } else if (result.includes("You win")) {
    return betAmount; // Regular win
  } else if (result.includes("You lose")) {
    return -betAmount; // Regular loss
  } else {
    return 0; // Tie, no winnings or losses
  }
}