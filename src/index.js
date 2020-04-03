import {apiCheck, covid19Info} from './api';
import {
	API_ERROR,
	COMMAND_countrylist,
	COMMAND_info,
	COMMAND_input,
	messageOptions,
	SOCKS_HOST,
	SOCKS_PORT,
	TOKEN
} from './constants';
import {
	infoNumber,
	errorNoCountry,
	showInfoByCountry,
	splitChunks,
	chunkArray,
	sendMessages,
	showStatus
} from './utils';
import TelegramBot from 'node-telegram-bot-api';

const Agent = require('socks5-https-client/lib/Agent');

const Covid19InfoBot = new TelegramBot(TOKEN, {
    polling: true,
    request: {
		agentClass: Agent,
		agentOptions: {
			socksHost: SOCKS_HOST,
			socksPort: SOCKS_PORT
		}
	}
});

Covid19InfoBot.onText(/\/start/i, (msg) => {
	const {id} = msg.chat;
	const waitMessage = Covid19InfoBot.sendMessage(id, COMMAND_input, messageOptions);

	covid19Info().then(({data}) => {
		const {covid19Stats} = data;
		if (apiCheck(covid19Stats)) {
			Covid19InfoBot
				.sendMessage(id, API_ERROR, messageOptions)
				.then(() => console.log('API_ERROR'))
				.catch(error => console.log(`The error occurred: ${error}`));
			return;
		}

		const countries = infoNumber(covid19Stats, 'country');
		waitMessage.then(({message_id}) => {
			Covid19InfoBot.deleteMessage(
				id,
				message_id
			).then(() => {
				Covid19InfoBot
					.sendMessage(
						id,
						`There are information about *${Object.keys(countries).length}* countries available.\n\n${COMMAND_countrylist}.\n\n${COMMAND_info}`,
						messageOptions
					)
					.then(() => console.log('NORMAL'))
					.catch(error => console.log(`The error occurred: ${error}`));
			}).catch(error => console.log(`The error occurred: ${error}`));
		}).catch(error => console.log(`The error occurred: ${error}`));
	});
});

Covid19InfoBot.onText(/\/info\s*("*[\w\s]*"*)\s*("*[\w\s]*"*)/i, (msg, match) => {
	if (!match || match[1] === '') {
		Covid19InfoBot
			.sendMessage(msg.chat.id, COMMAND_info, messageOptions)
			.then(() => console.log('NORMAL_NO_COUNTRY'))
			.catch(error => console.log(`The error occurred: ${error}`));
		return;
	}

	const countryName = match[1].replace(/"/g, '');
	const provinceName = match[2].replace(/"/g, '') || '';

	covid19Info(countryName).then(({data}) => {
		const {covid19Stats} = data;

		if (apiCheck(covid19Stats)) {
			Covid19InfoBot
				.sendMessage(msg.chat.id, API_ERROR, messageOptions)
				.then(() => console.log('API_ERROR'))
				.catch(error => console.log(`The error occurred: ${error}`));
			return;
		}

		if (!covid19Stats.find(({country}) => country.toLowerCase() === countryName.toLowerCase())) {
			errorNoCountry(msg.chat.id, Covid19InfoBot, countryName);
			return;
		}

		const params = {
			id: msg.chat.id,
			Covid19InfoBot,
			covid19Stats,
			countryName,
			provinceName
		};

		showInfoByCountry(params);
	});
});

Covid19InfoBot.onText(/\/countrylist/i, (msg) => {
	const {id} = msg.chat;
	const waitMessage = Covid19InfoBot.sendMessage(id, COMMAND_input, messageOptions);

	covid19Info().then(({data}) => {
		const {covid19Stats} = data;

		if (apiCheck(covid19Stats)) {
			Covid19InfoBot
				.sendMessage(id, API_ERROR, messageOptions)
				.then(() => console.log('API_ERROR'))
				.catch(error => console.log(`The error occurred: ${error}`));
			return;
		}

		const countries = infoNumber(covid19Stats, 'country');
		const countriesInlineButtons = splitChunks(countries, 'country', null);
		const countriesChunked = chunkArray(countriesInlineButtons, 20);

		let messages = countriesChunked.map((chunked, index) => ({
			text: `Part ${index + 1}`,
			options: {
				reply_markup: JSON.stringify({
					inline_keyboard: chunked,
					resize_keyboard: true
				}),
				parse_mode: 'Markdown'
			}
		}));

		messages = [{text: COMMAND_info, options: messageOptions}, ...messages];

		waitMessage.then(({message_id}) => {
			Covid19InfoBot.deleteMessage(
				id,
				message_id
			).then(() => {
				sendMessages(Covid19InfoBot, id, messages)
					.then(() => console.log('ALL_NORMAL'))
					.catch(error => console.log(`The error occurred: ${error}`));
			}).catch(error => console.log(`The error occurred: ${error}`));
		}).catch(error => console.log(`The error occurred: ${error}`));
	});
});

Covid19InfoBot.on('callback_query', msg => {
	const {id, first_name, username} = msg.from;
	const logMessage = `${first_name} (${username}): BUTTON - ${msg.data}`;
	console.log(logMessage);

	const [countryName, provinceName] = msg.data.split('_');

	covid19Info(countryName).then(({data}) => {
		const {covid19Stats} = data;

		if (apiCheck(covid19Stats)) {
			Covid19InfoBot
				.sendMessage(id, API_ERROR, messageOptions)
				.then(() => console.log('API_ERROR'))
				.catch(error => console.log(`The error occurred: ${error}`));
			return;
		}

		if (covid19Stats.find(({country}) => country !== countryName)) {
			errorNoCountry(id, Covid19InfoBot, countryName);
			return;
		}

		const params = {
			id,
			Covid19InfoBot,
			covid19Stats,
			countryName,
			provinceName
		};

		showInfoByCountry(params);
	});
});

Covid19InfoBot.on('polling_error', error => console.log(`The error occurred: ${error}`));

	/** Log Info */
Covid19InfoBot.onText(/.*/, (msg, match) => {
	const {first_name, username} = msg.chat;
	const logMessage = `${first_name} (${username}): TEXT - ${match.input}`;
	console.log(logMessage);
});

Covid19InfoBot.onText(/\/status/i, (msg) => {
	const waitMessage = Covid19InfoBot.sendMessage(msg.chat.id, COMMAND_input, messageOptions);

	covid19Info().then(({data}) => {
		const {covid19Stats} = data;

		if (apiCheck(covid19Stats)) {
			Covid19InfoBot
				.sendMessage(msg.chat.id, API_ERROR, messageOptions)
				.then(() => console.log('API_ERROR'))
				.catch(error => console.log(`The error occurred: ${error}`));
			return;
		}

		showStatus(msg.chat.id, Covid19InfoBot, covid19Stats, waitMessage);
	});
});
