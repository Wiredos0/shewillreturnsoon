module.exports = {
  config: {
    name: "rps",
    version: "1.0",
    description: "Rock, Paper, Scissors game",
    category: "Game",
  },
  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

    // Ensure the user has a balance property
    if (!userData.hasOwnProperty("balance")) {
      await usersData.set(senderID, { balance: 0 });
    }

    const choices = ["rock", "paper", "scissors"];
    const userChoice = args[0]?.toLowerCase();
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    if (!choices.includes(userChoice)) {
      return message.reply("Invalid choice. Please choose rock, paper, or scissors.");
    }

    const result = determineWinner(userChoice, botChoice);

    let winnings = 0;

    if (result === "win") {
      winnings = Math.floor(Math.random() * 100000) + 1;
      await usersData.set(senderID, { balance: userData.balance + winnings });
    }

    return message.reply(`You chose ${userChoice}, and the bot chose ${botChoice}. Result: ${result}. ${getLang("result_messages")[result]} ${winnings > 0 ? `You won $${winnings}!` : ""}`);
  },
};

function determineWinner(userChoice, botChoice) {
  if (userChoice === botChoice) {
    return "draw";
  } else if (
    (userChoice === "rock" && botChoice === "scissors") ||
    (userChoice === "paper" && botChoice === "rock") ||
    (userChoice === "scissors" && botChoice === "paper")
  ) {
    return "win";
  } else {
    return "lose";
  }
}