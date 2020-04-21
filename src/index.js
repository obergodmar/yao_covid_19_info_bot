import TelegramBot from 'node-telegram-bot-api';
import {
	logCommand
} from './utils';

import {
	buttonCommand,
	countryListCommand,
	infoCommand,
	startCommand,
	statusCommand
} from './commands';

require('http')
	.createServer()
	.listen(process.env.PORT || 5000)
	.on('request', (req, res) => {
		res.end('')
	});

const Covid19InfoBot = new TelegramBot(process.env.TOKEN, {
    polling: true
});

Covid19InfoBot
	.onText(
		/\/start/i,
		(msg) => startCommand(msg.chat.id, Covid19InfoBot)
	);

Covid19InfoBot
	.onText(
	/\/info\s*("*[\w\s]*"*)\s*("*[\w\s]*"*)/i,
	(msg, match) => infoCommand(msg.chat.id, Covid19InfoBot, match)
	);

Covid19InfoBot
	.onText(
		/\/countrylist/i,
		(msg) => countryListCommand(msg.chat.id, Covid19InfoBot)
	);

Covid19InfoBot
	.on(
		'callback_query',
		msg => buttonCommand(msg.from, msg, Covid19InfoBot)
	);

Covid19InfoBot
	.on(
		'polling_error',
		error => console.log(`The error occurred: ${error}`)
	);

Covid19InfoBot
	.onText(
		/.*/,
		(msg, match) => logCommand(msg.chat, match)
	);

Covid19InfoBot
	.onText(
		/\/status/i,
		(msg) => statusCommand(msg.chat.id, Covid19InfoBot)
	);
