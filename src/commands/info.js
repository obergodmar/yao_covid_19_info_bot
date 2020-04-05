import {API_ERROR, INFO, messageOptions} from '../constants';
import {apiCheck, covid19Info} from '../api';
import {errorNoCountry, showInfoByCountry} from '../utils';

export const infoCommand = (id, Covid19InfoBot, match) => {
    if (!match || match[1] === '') {
        Covid19InfoBot
            .sendMessage(id, INFO, messageOptions)
            .then(() => console.log('NORMAL_NO_COUNTRY'))
            .catch(error => console.log(`The error occurred: ${error}`));
        return;
    }

    const countryName = match[1].replace(/"/g, '');
    const provinceName = match[2].replace(/"/g, '') || '';

    covid19Info(countryName).then(({data}) => {
        const {covid19Stats} = data;

        if (apiCheck(covid19Stats)) {
            Covid19InfoBot
                .sendMessage(id, API_ERROR, messageOptions)
                .then(() => console.log('API_ERROR'))
                .catch(error => console.log(`The error occurred: ${error}`));
            return;
        }

        if (!covid19Stats.find(({country}) => country.toLowerCase() === countryName.toLowerCase())) {
            errorNoCountry(id, Covid19InfoBot, countryName);
            return;
        }

        const params = {
            id,
            Covid19InfoBot,
            covid19Stats,
            countryName,
            provinceName
        };

        showInfoByCountry(params);
    });
};
