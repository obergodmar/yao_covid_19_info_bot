export const accumulateInfo = (country, province, covid19Stats) => {
    let info = {
        country: country,
        province: province,
        lastUpdate: '',
        confirmed: 0,
        deaths: 0,
        recovered: 0
    };

    return covid19Stats.reduce((stats, info) => ({
        ...stats,
        lastUpdate: info.lastUpdate,
        confirmed: stats.confirmed + info.confirmed,
        deaths: stats.deaths + info.deaths,
        recovered: stats.recovered + info.recovered
    }), info);
};
