module.exports = {
    config: {
        name: "😺",
        version: "1.0",
        author: "Sahadat",
        countDown: 5,
        role: 0,
        shortDescription: "ignore this command",
        longDescription: "meow meow",
        category: "no prefix",
    },
    onStart: async function () {},
    onChat: async function ({ event, message, getLang, api }) {
        const trigger = 'cat';

        if (event.body && event.body.toLowerCase() === trigger) {
            return message.reply(`mewww, maoww!!😺\n\n🌐 System prefix: -\n🛸 Your box chat prefix: -`);
        }
    }
};
