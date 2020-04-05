export const infoNumber = (data, str) => (
    data.reduce((stats, info) => ({
        ...stats,
        [info[str]]: info[str]
    }), {})
);
