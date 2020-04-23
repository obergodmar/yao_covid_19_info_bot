import axios from 'axios';
const API = 'covid-19-coronavirus-statistics.p.rapidapi.com';

const API_OPTIONS = {
	method: "GET",
    url: `https://${API}/v1/stats`,
    headers: {
		"content-type": "application/octet-stream",
		"x-rapidapi-host": API,
		"x-rapidapi-key": process.env.API_KEY
    }
};

export const covid19Info = (countryName = '') => axios({
    ...API_OPTIONS,
    params: {
		country: countryName
	}
    })
    .then(({data}) => data)
	.catch(error => `The error occurred: ${error}`);

export const apiCheck = (covid19Stats) => (
    covid19Stats.find(stat => !(
    		stat.hasOwnProperty('country') &&
    		stat.hasOwnProperty('city') &&
			stat.hasOwnProperty('province') &&
			stat.hasOwnProperty('lastUpdate') &&
			stat.hasOwnProperty('confirmed') &&
			stat.hasOwnProperty('deaths') &&
			stat.hasOwnProperty('recovered')
		)
    )
);
