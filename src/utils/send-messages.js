import Promise from 'bluebird';

export const sendMessages = (bot, chatId, messages) => (
    Promise.mapSeries(messages, (message) =>
        bot.sendMessage(chatId, message.text, message.options)
    )
);
