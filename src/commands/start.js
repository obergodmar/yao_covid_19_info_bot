import {API_ERROR, INFO, INFO_COUNTRY_LIST, INFO_INPUT, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {infoNumber} from '../utils';

export const startCommand = (id, Covid19InfoBot) => {
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
        waitMessage.then(({message_id}) => {
            Covid19InfoBot.deleteMessage(
                id,
                message_id
            ).then(() => {
                Covid19InfoBot
                    .sendMessage(
                        id,
                        `There are information about *${Object.keys(countries).length}* countries available.\n\n${INFO_COUNTRY_LIST}.\n\n${INFO}`,
                        messageOptions
                    )
                    .then(() => console.log('NORMAL'))
                    .catch(error => console.log(`The error occurred: ${error}`));
            }).catch(error => console.log(`The error occurred: ${error}`));
        }).catch(error => console.log(`The error occurred: ${error}`));
    });
};
