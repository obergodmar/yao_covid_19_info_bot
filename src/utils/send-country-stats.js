import {deleteMessage} from './delete-message';
import {printInfo} from './print-info';
import {messageOptions} from '../constants';

export const sendCountryStats = (id, Covid19InfoBot, waitMessage, params) => {
    deleteMessage(id, Covid19InfoBot, waitMessage)
        .then(() => {
            Covid19InfoBot
                .sendMessage(
                    id,
                    printInfo(params),
                    messageOptions
                )
                .then(() => console.log('NORMAL'))
                .catch(error => console.log(`The error occurred: ${error}`));
        }).catch(error => console.log(`The error occurred: ${error}`));
};
