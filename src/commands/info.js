import {INFO, INFO_INPUT, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {apiCheckError, errorNoCountry, showInfoByCountry} from '../utils';

export const infoCommand = (id, Covid19InfoBot, match) => {
    if (!match || match[1] === '') {
        Covid19InfoBot
            .sendMessage(id, INFO, messageOptions)
            .then(() => console.log('NORMAL_NO_COUNTRY'))
            .catch(error => console.log(`The error occurred: ${error}`));
        return;
    }

    const waitMessage = Covid19InfoBot.sendMessage(id, INFO_INPUT, messageOptions);

    const countryName = match[1].replace(/"/g, '');
    const provinceName = match[2].replace(/"/g, '') || '';

    covid19Info(countryName).then(({data}) => {
        if (!data) {
            apiCheckError(id, Covid19InfoBot, waitMessage);
            return;
        }

        const {covid19Stats} = data;

        if (apiCheck(covid19Stats)) {
            apiCheckError(id, Covid19InfoBot, waitMessage);
            return;
        }

        if (!covid19Stats.find(({country}) => country && country.toLowerCase() === countryName.toLowerCase())) {
            errorNoCountry(id, Covid19InfoBot, countryName, waitMessage);
            return;
        }

        const params = {
            id,
            Covid19InfoBot,
            covid19Stats,
            countryName,
            provinceName,
            waitMessage
        };

        showInfoByCountry(params);
    });
};
