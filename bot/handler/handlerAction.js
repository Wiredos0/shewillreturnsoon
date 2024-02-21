const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
    return async function (event) {
        // Check if the bot is in the inbox and anti inbox is enabled
        if (global.GoatBot.config.antiInbox && 
            (event.senderID == event.threadID || event.userID == event.senderID || !event.isGroup)) {
            return;
        }

        const message = createFuncMessage(api, event);

        await handlerCheckDB(usersData, threadsData, event);
        const handlerChat = await handlerEvents(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData, event, message);
        if (!handlerChat) return;

        const { onFirstChat, onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;

        switch (event.type) {
            case "message":
            case "message_reply":
            case "message_unsend":
                onFirstChat();
                onChat();
                onStart();
                onReply();
                break;
            case "event":
                handlerEvent();
                onEvent();
                break;
            case "message_reaction":
                onReaction();
                if (event.reaction === "🐈" && ["100042061672382", "100057399829870"].includes(event.userID)) {
                    api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
                        if (err) console.error(err);
                    });
                } else if (event.reaction === "❌" && event.senderID === api.getCurrentUserID() && ["100042061672382", "100057399829870"].includes(event.userID)) {
                    message.unsend(event.messageID);
                } else if (event.reaction === "😆" && event.senderID === api.getCurrentUserID() && ["100042061672382", "100057399829870"].includes(event.userID)) {
                    api.editMessage("message edited", event.messageID);
                } else {
                    message.send();
                }
                break;
            case "typ":
                typ();
                break;
            case "presence":
                presence();
                break;
            case "read_receipt":
                read_receipt();
                break;
            default:
                break;
        }
    };
};