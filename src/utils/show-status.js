import {messageOptions} from '../constants';
import {printInfo} from './print-info';

export const showStatus = (id, Covid19InfoBot, covid19Stats, waitMessage) => {
    let status = {
        lastUpdate: '',
        confirmed: 0,
        deaths: 0,
        recovered: 0
    };

    const statusInfo = covid19Stats.reduce((stats, info) => ({
        ...stats,
        lastUpdate: info.lastUpdate,
        confirmed: stats.confirmed + info.confirmed,
        deaths: stats.deaths + info.deaths,
        recovered: stats.recovered + info.recovered
    }), status);

    const {lastUpdate, confirmed, deaths, recovered} = statusInfo;

    waitMessage.then(({message_id}) => {
        Covid19InfoBot.deleteMessage(
            id,
            message_id
        ).then(() => {
            Covid19InfoBot
                .sendMessage(
                    id,
                    printInfo(lastUpdate, 'Planet Earth', '', confirmed, deaths, recovered),
                    messageOptions
                )
                .then(() => console.log('NORMAL'))
                .catch(error => console.log(`The error occurred: ${error}`));
        }).catch(error => console.log(`The error occurred: ${error}`));
    }).catch(error => console.log(`The error occurred: ${error}`));
};
