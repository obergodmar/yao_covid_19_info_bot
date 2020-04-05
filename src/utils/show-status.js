import {accumulateInfo} from './accumulate-info';
import {sendCountryStats} from './send-country-stats';

export const showStatus = (id, Covid19InfoBot, covid19Stats, waitMessage) => {
    const params = accumulateInfo('Planet Earth', '', covid19Stats);
    sendCountryStats(id, Covid19InfoBot, waitMessage, params);
};
