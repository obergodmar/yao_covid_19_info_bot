import TelegramBot from 'node-telegram-bot-api';
const Agent = require('socks5-https-client/lib/Agent');
import {
	SOCKS_HOST,
	SOCKS_PORT,
	TOKEN
} from './constants';
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

process.env.NTBA_FIX_319 = 1;

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
		(msg, match) => logCommand(msg.chat, match));

Covid19InfoBot
	.onText(
		/\/status/i,
		(msg) => statusCommand(msg.chat.id, Covid19InfoBot)
	);
