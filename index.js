var argv = require('yargs').argv;
var request = require('request');
var colors = require('colors');
var encoders = require('./src/encoders');

// var encodedContent = encoders.createEncodedList();



function createList() {
    var encodedList = encoders.createEncodedList();
    console.log(encodedList);
    return encodedList;
}


function decodeList (encodedContent) {
    var list = encoders.decodeList(encodedContent);

    var venueRequests = [];
    list.items.forEach(function(item) {
        var venueRequest = new Promise (function(resolve) {
            request('https://api.theinfatuation.com/services/v3/venues/'+item.infatuation, function(error, http, response) {
                resolve(JSON.parse(response));
            });
        });
        venueRequests.push(venueRequest);
    });

    console.log(colors.blue(colors.bold('=== '+list.label+' ===')));
    console.log(list.blurb.msg);
    process.stdout.write(colors.italic('Getting venues....'));

    Promise.all(venueRequests).then(function(venues) {
        process.stdout.clearLine();
        process.stdout.write('\n');
        venues.forEach(function(venue, idx) {
            console.log(colors.bold(`${idx+1}. ${venue.name}`));
            console.log(`${venue.street} ${venue.city}, ${venue.state}`);
            console.log('');
        });
    });
}

// var encodedContent = createList();




if (argv.create) {
    createList();
}
else if (argv._.length) {
    var encoded = argv._[0];

    decodeList(encoded);
}
else {
    console.log(colors.red('YOU MUST EITHER --create or PASS A BASE64 STRING, OK?'));
}
// console.log(argv._);

// decodeList(encodedContent);
