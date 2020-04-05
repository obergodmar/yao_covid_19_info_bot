import {API_ERROR, INFO, INFO_INPUT, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {chunkArray, infoNumber, sendMessages, splitChunks} from '../utils';

export const countryListCommand = (id, Covid19InfoBot) => {
    const waitMessage = Covid19InfoBot.sendMessage(id, INFO_INPUT, messageOptions);

    covid19Info().then(({data}) => {
        const {covid19Stats} = data;

        if (apiCheck(covid19Stats)) {
            Covid19InfoBot
                .sendMessage(id, API_ERROR, messageOptions)
                .then(() => console.log('API_ERROR'))
                .catch(error => console.log(`The error occurred: ${error}`));
            return;
        }

        const countries = infoNumber(covid19Stats, 'country');
        const countriesInlineButtons = splitChunks(countries, 'country', null);
        const countriesChunked = chunkArray(countriesInlineButtons, 20);

        let messages = countriesChunked.map((chunked, index) => ({
            text: `Part ${index + 1}`,
            options: {
                reply_markup: JSON.stringify({
                    inline_keyboard: chunked,
                    resize_keyboard: true
                }),
                parse_mode: 'Markdown'
            }
        }));

        messages = [{text: INFO, options: messageOptions}, ...messages];

        waitMessage.then(({message_id}) => {
            Covid19InfoBot.deleteMessage(
                id,
                message_id
            ).then(() => {
                sendMessages(Covid19InfoBot, id, messages)
                    .then(() => console.log('ALL_NORMAL'))
                    .catch(error => console.log(`The error occurred: ${error}`));
            }).catch(error => console.log(`The error occurred: ${error}`));
        }).catch(error => console.log(`The error occurred: ${error}`));
    });
};
