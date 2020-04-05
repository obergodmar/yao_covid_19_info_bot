import {API_ERROR, INFO_INPUT, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {showStatus} from '../utils';

export const statusCommand = (id, Covid19InfoBot) => {
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

        showStatus(id, Covid19InfoBot, covid19Stats, waitMessage);
    });
};
