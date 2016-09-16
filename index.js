const argv = require('yargs').argv;
const range = require('lodash/range');
const colors = require('colors');
const api = require('./src/api');

if (argv.create) {
    const itemsCount = (typeof argv.create) !== 'boolean' ? parseInt(argv.create) : undefined;
    const encoded = api.createList(itemsCount);
    console.log(encoded);
}
else if (argv._.length) {
    const decoded = api.decodeList(argv._[0]);
    const list = decoded.list;
    const venueRequests = decoded.venues;

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
else {
    console.log(colors.red('YOU MUST EITHER --create or PASS A BASE64 STRING, OK?'));
}
