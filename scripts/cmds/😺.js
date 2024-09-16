const responses = [
    "MEOW MEOW!! 🤎🐾",
    "MEOW WHAT:)? 😸",
    "Meowww Maowww",
    "😺🐾",
    "YES? MEOW 🐾",
    " MEOW, I Am A Fluffy CaT 😺🐾",
    "Perfectly Adorable, That's Me 🐾😻",
    "What Do You Need, Hooman? 😽🤎",
    "*Purrs* Meow, Hooman!! 😻",
    "I'm Feeling Pawsitively Adorable Right Meow! 😻🐾",
    "Meow-velous To Here You Think I'm Cuttey! 😸🤎🐾",
    "HELLO!! Am Here 😺🐾",
    "Do You Know Me? 🐾",
    "HEY!! Did You Call me? 😺",
    "HEY, Your Cutey Here 🤎🤗",
    "Meow~ 🐾😺"];

module.exports = {
    config: {
        name: "😺",
        version: "1.0",
        author: "Sahadat",
        countDown: 5,
        role: 0,
        description: "auto reply, not cmd",
        category: "No Prefix",
    },
    onStart: async function(){}, 
    onChat: async function ({ event, message }) {
        try {
            if (!event || !event.body) {
                return;
            }
            const userInput = event.body.toLowerCase();
            const firstWord = userInput.split(" ")[0];
            const keywords = ["cat"];
            if (keywords.includes(firstWord)) {
                const randomIndex = Math.floor(Math.random() * responses.length);
                const randomResponse = responses[randomIndex];
                return message.reply(randomResponse);
            }
        } catch (e) {
            console.error(e);
        }
    }
};
