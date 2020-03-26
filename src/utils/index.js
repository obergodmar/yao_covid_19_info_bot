import Promise from 'bluebird';
import {COMMAND_countrylist, messageOptions} from '../constants';

export const printInfo = (
	lastUpdate,
	country,
	province,
	confirmed,
	deaths,
	recovered
	) => {
		const timeOptions = {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			day: 'numeric',
			month: 'long',
			timeZoneName: 'short'
		};

		const lastUpdateInfo = `Last Update: _${new Date(lastUpdate).toLocaleDateString('en-US', timeOptions)}_`;
		const countryName = province ? `*${country}, ${province}*` : `*${country}*`;
		const whereInfo = `Where: ${countryName}`;
		const confirmedInfo = `Сases сonfirmed: *${confirmed}*`;
		const deathsInfo = `Number of deaths: *${deaths}*`;
		const recoveredInfo = `Recovered: *${recovered}*`;

		return `${lastUpdateInfo}\n${whereInfo}\n\n${confirmedInfo}\n${deathsInfo}\n${recoveredInfo}`;
};

export const sendMessages = (bot, chatId, messages) => (
	Promise.mapSeries(messages, (message) =>
		bot.sendMessage(chatId, message.text, message.options)
	)
);

export const errorNoCountry = (id, Covid19InfoBot, countryName) => (
	Covid19InfoBot
		.sendMessage(
			id,
			`*Error*: "${countryName}" is not in a country list. ${COMMAND_countrylist}`,
			messageOptions
    	)
		.then(() => console.log('ERROR_NO_COUNTRY'))
		.catch(error => console.log(`The error occurred: ${error}`))
);

export const infoNumber = (data, str) => (
	data.reduce((stats, info) => ({
		...stats,
		[info[str]]: info[str]
	}), {})
);

export const chunkArray = (array, chunkSize) => {
	let result = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		result.push(array.slice(i, i + chunkSize));
	}
	return result;
};

export const splitChunks = (data, type, country) => {
	const values = Object.values(data).sort();
	const buttons = values.map(info => (
		{
			text: info,
			callback_data: type === 'country' ? `${info}_none` : `${country}_${info}`
		}
	));
	return chunkArray(buttons, 3);
};

export const showInfoByCountry = ({
	  id,
	  Covid19InfoBot,
	  covid19Stats,
	  countryName,
	  provinceName
}) => {
	const countryStats = covid19Stats.filter(({country}) =>
		country.toLowerCase() === countryName.toLowerCase());
	const countryStatsByProvince = countryStats.find(({province}) =>
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

	if (countryStatsByProvince) {
		if (countryStatsByProvince.length) {
			let countryStatsByProvinceInfo = {
				country: countryName,
				province: provinceName,
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

		const {country, lastUpdate, province, confirmed, deaths, recovered} = countryStatsByProvince;

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
			inline_keyboard: splitChunks(provinces, 'province', countryName),
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
