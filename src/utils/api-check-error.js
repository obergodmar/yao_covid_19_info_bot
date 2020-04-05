import {API_ERROR, messageOptions} from '../constants';
import {deleteMessage} from './delete-message';

export const apiCheckError = (id, Covid19InfoBot, waitMessage) => (
    deleteMessage(id, Covid19InfoBot, waitMessage).then(() => {
        Covid19InfoBot
            .sendMessage(id, API_ERROR, messageOptions)
            .then(() => console.log('API_ERROR'))
            .catch(error => console.log(`The error occurred: ${error}`));
    }).catch(error => console.log(`The error occurred: ${error}`))
);
