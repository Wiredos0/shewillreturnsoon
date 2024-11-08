const axios = require("axios");

module.exports = {
    config: {
        name: "news",
        version: "1.0",
        author: "NZ R",
        countDown: 5,
        role: 0,
        category: "Information",
        guide: {
           en: "-news <category/source/country> [optional keywords]\n\nUsages:\n- news sports\n- news bbc\n- news us\n- news today's condom rate"
   },
 },

    onStart: async function({ message, args }) {
        if (!args.length) {
            return message.reply("Please specify a news category, source, or country.");
        }
        
        const query = args.join(" ");
        const apiUrl = `https://nexus-news-by-nzr.onrender.com/news?query=${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(apiUrl);
            const newsData = response.data.news;

            if (!newsData || newsData.length === 0) {
                return message.reply("No news 🗞 ");
            }

            let newsMessage = `📰 Top News (${query}):\n\n`;
            newsData.forEach((article, index) => {
                newsMessage += `${index + 1}. ${article.title}\n`;
                newsMessage += `𝐒𝐨𝐮𝐫𝐜𝐞: ${article.source}\n`;
                newsMessage += `𝐏𝐮𝐛𝐥𝐢𝐬𝐡𝐞𝐝: ${article.published}\n`;
                newsMessage += `🔗 𝐔𝐑𝐋: ${article.url}\n\n`;
                newsMessage += '----------------------------------------\n\n';
            });

            message.reply(newsMessage);
        } catch (error) {
            console.error("Error fetching news:", error);
            message.reply("Sorry, an error occurred while fatching the news.");
        }
    }
};
