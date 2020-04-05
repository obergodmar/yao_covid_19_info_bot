import {INFO_COUNTRY_LIST, messageOptions} from '../constants';

export const errorNoCountry = (id, Covid19InfoBot, countryName) => (
    Covid19InfoBot
        .sendMessage(
            id,
            `*Error*: "${countryName}" is not in a country list. ${INFO_COUNTRY_LIST}`,
            messageOptions
        )
        .then(() => console.log('ERROR_NO_COUNTRY'))
        .catch(error => console.log(`The error occurred: ${error}`))
);
