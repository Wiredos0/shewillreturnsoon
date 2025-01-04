const responses = [
    "MEOW MEOW!! 🤎🐾",
    "MEOW WHAT:)? 😸",
    "Meowww Maowww",
    "😺🐾",
    "YES? MEOW 🐾",
    "MEOW, I Am A Fluffy Cat 😺🐾",
    "Perfectly Adorable, That's Me 🐾😻",
    "What Do You Need, Hooman? 😽🤎",
    "*Purrs* Meow, Hooman!! 😻",
    "I'm Feeling Pawsitively Adorable Right Meow! 😻🐾",
    "Meow-velous To Hear You Think I'm Cute! 😸🤎🐾",
    "HELLO!! Am Here 😺🐾",
    "Do You Know Me? 🐾",
    "HEY!! Did You Call Me? 😺",
    "HEY, Your Cutey Here 🤎🤗",
    "Meow~ 🐾😺",
    "Meow Meow! Did Someone Say Cat? 😻🐾",
    "Purrfect Day To Be A Cat! 😽🐾",
    "Hooman, Stop Calling Me For Treats! 😸",
    "I’m The Purrfect Companion, Don’t You Think? 😻🐾",
    "MEOW!! What's The Plan Today? 😺",
    "I’m Not Just A Cat, I’m THE Cat! 😽",
    "Feed Me First, Then We Talk! 😸",
    "You Rang? Meowwwww! 🐾",
    "Purrs Of Joy To You, Hooman! 😻",
    "Do You Want Me To Show You My Pawsome Side? 😺",
    "Don't Disturb My Catnap Unless It's Important! 🐾",
    "Meow Is The Answer To Everything! 😸",
    "I’m The King Of The House, Respect Me! 😻",
    "My Hooman, Have You Brought Snacks? 🐾",
    "Meowgic Happens When I'm Around! 😽",
    "Hooman, Your Cat Overlord Is Listening! 😸",
    "I’m Majestic And I Know It! 😻",
    "Attention, Hooman! I Require Treats. Now. 🐾",
    "Meow, But Only Because I Feel Like It! 😺",
    "I’m A Fluffy Ball Of Chaos And Love! 😻",
    "No One Does Purrfection Like Me! 🐾",
    "Meow, Let’s Make Today Pawsome! 😸",
    "I’m Not Demanding, I’m Just Purrsistent! 😽",
    "Meowww, The Universe Revolves Around Me! 🐾",
    "I’m Purr-sonally Here For You! 😽",
    "Meow-nificent To See You Again, Hooman! 😻",
    "Call Me Again And I’ll Think About Responding! 🐾",
    "Life’s Better With Me Around! 😸",
    "Am I Not The Purrfect Distraction? 😺",
    "Let’s Talk Meowgic, Shall We? 😻",
    "I Meow Therefore I Am! 🐾",
    "Even My Paws Are Cuter Than You Think! 😽",
    "I’m Too Fluffy To Handle Right Now! 😸",
    "Have You Petted A Cat Today? Try Me! 🐾",
    "Paws Up, Let’s Do This! 😺",
    "You’ve Summoned Meow Majesty! 😻",
    "I’m Feeling Purrstigious Today, Don’t You Agree? 🐾",
    "Hooman, Don’t Forget My Royal Nap Schedule! 😽",
    "Meow, The World Revolves Around My Whiskers! 😸"
];

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
    onStart: async function() {},
    onChat: async function ({ event, message }) {
        try {
            if (!event || !event.body) {
                return;
            }
            const userInput = event.body.trim().toLowerCase();
            if (userInput === "cat") {
                const randomIndex = Math.floor(Math.random() * responses.length);
                const randomResponse = responses[randomIndex];
                return message.reply(randomResponse);
            }
        } catch (e) {
            console.error(e);
        }
    }
};
