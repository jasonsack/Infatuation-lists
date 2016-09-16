'use-strict';

const request = require('request');
const encoders = require('./encoders');

module.exports.createList = function createList (itemsCount) {
    return encoders.createEncodedList(itemsCount);
}

module.exports.decodeList = function decodeList (encodedContent) {
    const list = encoders.decodeList(encodedContent);
    const venueRequests = list.items.map(item => {
        return new Promise (resolve => {
            request(`https://api.theinfatuation.com/services/v3/venues/${item.infatuation}`, (error, http, response) => {
                resolve(JSON.parse(response));
            });
        });
    });

    return {
        list: list,
        venues: venueRequests,
    };
}
