import {chunkArray} from './chunk-array';

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
