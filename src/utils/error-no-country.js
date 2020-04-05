import {INFO_COUNTRY_LIST, messageOptions} from '../constants';
import {deleteMessage} from './delete-message';

export const errorNoCountry = (id, Covid19InfoBot, countryName, waitMessage) => (
    deleteMessage(id, Covid19InfoBot, waitMessage).then(() => {
        Covid19InfoBot
            .sendMessage(
                id,
                `*Error*: "${countryName}" is not in a country list. ${INFO_COUNTRY_LIST}`,
                messageOptions
            )
            .then(() => console.log('ERROR_NO_COUNTRY'))
            .catch(error => console.log(`The error occurred: ${error}`))
    }).catch(error => console.log(`The error occurred: ${error}`))
);
