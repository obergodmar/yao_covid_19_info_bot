import {infoNumber} from './info-number';
import {splitChunks} from './split-chunks';
import {sendCountryStats} from './send-country-stats';
import {deleteMessage} from './delete-message';
import {accumulateInfo} from './accumulate-info';
import {printInfo} from './print-info';
import {messageOptions} from '../constants';

export const showInfoByCountry = ({
      id,
      Covid19InfoBot,
      covid19Stats,
      countryName,
      provinceName,
      waitMessage
}) => {
    const countryStats = covid19Stats.filter(({country}) =>
        country.toLowerCase() === countryName.toLowerCase());

    const countryParams = accumulateInfo(countryStats[0].country, '', covid19Stats);

    const countryStatsByProvince = countryStats.filter(({province}) =>
        province.toLowerCase() === provinceName.toLowerCase());

    if (countryStats && countryStats.length === 1) {
        const [params] = countryStats;
        sendCountryStats(id, Covid19InfoBot, waitMessage, params);
        return;
    }

    if (countryStatsByProvince && countryStatsByProvince.length) {
        const params = accumulateInfo(
            countryStatsByProvince[0].country,
            countryStatsByProvince[0].province,
            countryStatsByProvince
        );

        sendCountryStats(id, Covid19InfoBot, waitMessage, params);
        return;
    }

    const provinces = infoNumber(countryStats, 'province');

    const provinceButtons = {
        reply_markup: JSON.stringify({
            inline_keyboard: splitChunks(provinces, 'province', countryStats[0].country),
        })
    };

    deleteMessage(id, Covid19InfoBot, waitMessage)
        .then(() => {
            Covid19InfoBot
                .sendMessage(
                    id,
                    `${countryName} has ${Object.keys(provinces).length} provinces. Which province do you need?`,
                    provinceButtons
                )
                .then(() => {
                    Covid19InfoBot
                        .sendMessage(
                            id,
                            printInfo(countryParams),
                            messageOptions
                        ).then(() => console.log('NORMAL'))
                        .catch(error => console.log(`The error occurred: ${error}`));
                }).catch(error => console.log(`The error occurred: ${error}`));
        }).catch(error => console.log(`The error occurred: ${error}`));

};
