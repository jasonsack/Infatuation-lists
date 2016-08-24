const argv = require('yargs').argv;
const request = require('request');
const colors = require('colors');
const encoders = require('./src/encoders');
const range = require('lodash/range');

function createList (itemsCount) {
    var encodedList = encoders.createEncodedList(itemsCount);
    console.log(encodedList);
    return encodedList;
}

function decodeList (encodedContent) {
    const list = encoders.decodeList(encodedContent);

    const venueRequests = list.items.map(item => {
        return new Promise (resolve => {
            request(`https://api.theinfatuation.com/services/v3/venues/${item.infatuation}`, (error, http, response) => {
                resolve(JSON.parse(response));
            });
        });
    });

    console.log(colors.bgCyan(colors.bold(`=== ${list.label} ===`)));
    console.log(list.blurb.msg);
    process.stdout.write(colors.italic('Getting venues....'));

    Promise.all(venueRequests).then(venues => {
        process.stdout.clearLine();
        process.stdout.write('\n');
        
        venues.forEach((venue, idx) => {
            const price = range(venue.price).map(() => '$');

            console.log(colors.bold(`${idx+1}. ${venue.name} ${colors.bgCyan(colors.black(price.join('')))}`));
            console.log(`${venue.street} ${venue.city}, ${venue.state}`);
            console.log('');
        });
    });
}

if (argv.create) {
    const itemsCount = (typeof argv.create) !== 'boolean' ? parseInt(argv.create) : undefined;
    createList(itemsCount);
}
else if (argv._.length) {
    const encoded = argv._[0];
    decodeList(encoded);
}
else {
    console.log(colors.red('YOU MUST EITHER --create or PASS A BASE64 STRING, OK?'));
}
