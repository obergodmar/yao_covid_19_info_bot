export const printInfo = ({
      lastUpdate,
      country,
      province,
      confirmed,
      deaths,
      recovered
}) => {
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
    const confirmedInfo = `Cases confirmed: *${confirmed}*`;
    const deathsInfo = `Number of deaths: *${deaths}*`;
    const recoveredInfo = `Recovered: *${recovered}*`;

    return `${lastUpdateInfo}\n${whereInfo}\n\n${confirmedInfo}\n${deathsInfo}\n${recoveredInfo}`;
};
