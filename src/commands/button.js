import {apiCheck, covid19Info} from '../api';
import {API_ERROR, messageOptions} from '../constants';
import {errorNoCountry, showInfoByCountry} from '../utils';

export const buttonCommand = ({id, first_name, username}, {data}, Covid19InfoBot) => {
    const logMessage = `${first_name} (${username}): BUTTON - ${data}`;
    console.log(logMessage);

    const [countryName, provinceName] = data.split('_');

    covid19Info(countryName).then(({data}) => {
        const {covid19Stats} = data;

        if (apiCheck(covid19Stats)) {
            Covid19InfoBot
                .sendMessage(id, API_ERROR, messageOptions)
                .then(() => console.log('API_ERROR'))
                .catch(error => console.log(`The error occurred: ${error}`));
            return;
        }

        if (covid19Stats.find(({country}) => country !== countryName)) {
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
