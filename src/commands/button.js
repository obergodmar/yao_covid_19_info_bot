import {apiCheck, covid19Info} from '../api';
import {apiCheckError, errorNoCountry, showInfoByCountry} from '../utils';
import {INFO_INPUT, messageOptions} from '../constants';

export const buttonCommand = ({id, first_name, username}, {data}, Covid19InfoBot) => {
    const waitMessage = Covid19InfoBot.sendMessage(id, INFO_INPUT, messageOptions);
    const logMessage = `${first_name} (${username}): BUTTON - ${data}`;
    console.log(logMessage);

    const [countryName, provinceName] = data.split('_');

    covid19Info(countryName).then(({data}) => {
        const {covid19Stats} = data;

        if (apiCheck(covid19Stats)) {
            apiCheckError(id, Covid19InfoBot, waitMessage);
            return;
        }

        if (covid19Stats.find(({country}) => country !== countryName)) {
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
