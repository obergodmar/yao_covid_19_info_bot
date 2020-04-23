import {INFO, INFO_COUNTRY_LIST, INFO_INPUT, INFO_STATUS, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {apiCheckError, deleteMessage, infoNumber} from '../utils';

export const startCommand = (id, Covid19InfoBot) => {
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

        deleteMessage(id, Covid19InfoBot, waitMessage)
            .then(() => {
                Covid19InfoBot
                    .sendMessage(
                        id,
                        `There are information about *${Object.keys(countries).length}* countries available.\n\n${INFO_COUNTRY_LIST}.\n\n${INFO_STATUS}.\n\n${INFO}`,
                        messageOptions
                    )
                    .then(() => console.log('NORMAL'))
                    .catch(error => console.log(`The error occurred: ${error}`));
            }).catch(error => console.log(`The error occurred: ${error}`));
    });
};
