import {INFO, INFO_INPUT, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {apiCheckError, chunkArray, deleteMessage, infoNumber, sendMessages, splitChunks} from '../utils';

export const countryListCommand = (id, Covid19InfoBot) => {
    const waitMessage = Covid19InfoBot.sendMessage(id, INFO_INPUT, messageOptions);

    covid19Info().then(({data}) => {
        if (!data) {
            apiCheckError(id, Covid19InfoBot, waitMessage);
            return;
        }

        const {covid19Stats} = data;

        if (apiCheck(covid19Stats)) {
            apiCheckError(id, Covid19InfoBot, waitMessage);
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

        deleteMessage(id, Covid19InfoBot, waitMessage).then(() => {
            sendMessages(Covid19InfoBot, id, messages)
                .then(() => console.log('ALL_NORMAL'))
                .catch(error => console.log(`The error occurred: ${error}`));
        }).catch(error => console.log(`The error occurred: ${error}`));
    });
};
