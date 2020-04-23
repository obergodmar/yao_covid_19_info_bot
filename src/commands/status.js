import {INFO_INPUT, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {apiCheckError, showStatus} from '../utils';

export const statusCommand = (id, Covid19InfoBot) => {
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

        showStatus(id, Covid19InfoBot, covid19Stats, waitMessage);
    });
};
