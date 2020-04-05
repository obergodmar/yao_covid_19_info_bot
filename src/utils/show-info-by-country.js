import {messageOptions} from '../constants';
import {printInfo} from './print-info';
import {infoNumber} from './info-number';
import {splitChunks} from './split-chunks';

export const showInfoByCountry = ({
      id,
      Covid19InfoBot,
      covid19Stats,
      countryName,
      provinceName
}) => {
    const countryStats = covid19Stats.filter(({country}) =>
        country.toLowerCase() === countryName.toLowerCase());

    const countryStatsByProvince = countryStats.filter(({province}) =>
        province.toLowerCase() === provinceName.toLowerCase());

    if (countryStats && countryStats.length === 1) {
        const [{country, lastUpdate, province, confirmed, deaths, recovered}] = countryStats;
        Covid19InfoBot
            .sendMessage(
                id,
                printInfo(lastUpdate, country, province, confirmed, deaths, recovered),
                messageOptions
            )
            .then(() => console.log('NORMAL'))
            .catch(error => console.log(`The error occurred: ${error}`));
        return;
    }

    if (countryStatsByProvince && countryStatsByProvince.length) {
        let countryStatsByProvinceInfo = {
            country: countryStatsByProvince[0].country,
            province: countryStatsByProvince[0].province,
            lastUpdate: countryStatsByProvince[0].lastUpdate,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        };

        countryStatsByProvinceInfo = countryStatsByProvince.reduce((stats, info) => ({
            ...stats,
            confirmed: stats.confirmed + info.confirmed,
            deaths: stats.deaths + info.deaths,
            recovered: stats.recovered + info.recovered
        }), countryStatsByProvinceInfo);

        const {country, lastUpdate, province, confirmed, deaths, recovered} = countryStatsByProvinceInfo;
        Covid19InfoBot
            .sendMessage(
                id,
                printInfo(lastUpdate, country, province, confirmed, deaths, recovered),
                messageOptions
            )
            .then(() => console.log('NORMAL'))
            .catch(error => console.log(`The error occurred: ${error}`));
        return;
    }

    const provinces = infoNumber(countryStats, 'province');

    const provinceButtons = {
        reply_markup: JSON.stringify({
            inline_keyboard: splitChunks(provinces, 'province', countryStats[0].country),
        })
    };

    Covid19InfoBot
        .sendMessage(
            id,
            `${countryName} has ${Object.keys(provinces).length} provinces. Which province do you need?`,
            provinceButtons
        )
        .then(() => console.log('NORMAL'))
        .catch(error => console.log(`The error occurred: ${error}`));
};
