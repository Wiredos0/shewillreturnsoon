module.exports = {
    echoActive: false,

    config: {
        name: 'echo',
        version: '1.0',
        author: 'Cruizex',
        shortDescription: 'Echoes messages in the group',
        category: 'utility',
        guide: {
            en: '{p}{n} activate/deactivate',
        }
    },

    onStart: async function ({ api, event }) {
        try {
            const threadID = event?.threadID;

            if (event?.body.toLowerCase().includes('echo activate')) {
                this.echoActive = true;
                api.sendMessage('Echo activated ✅ I will now echo any message sent in the group.', threadID);
            } else if (event?.body.toLowerCase().includes('echo deactivate')) {
                this.echoActive = false;
                api.sendMessage('Echo deactivated ⭕ I will stop echoing messages.', threadID);
            }
        } catch (error) {
            console.error('Error in echo command:', error);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            if (this.echoActive && !event?.body.toLowerCase().includes('echo deactivate')) {
                api.sendMessage(event?.body, event?.threadID);
            }
        } catch (error) {
            console.error('Error in echo command:', error);
        }
    },
};
