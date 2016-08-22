var ProtoBuf = require('protobufjs');
var lzma = require('lzma');
var base64 = require('js-base64').Base64;
var path = require('path');

var builder = ProtoBuf.loadProtoFile(path.join(__dirname, '../', 'protobuf', 'list.proto'));
var InfatuationList = builder.build('infatuation.list');

var List = InfatuationList.List;
var Item = InfatuationList.Item;
var Annotation = InfatuationList.Annotation;
var User = InfatuationList.User;

var listFactory = {
    id: '1',
    label: 'Test List',
    blurb: new Annotation({
        user: new User({
            id: '1',
            name: 'Jason',
        }),
        msg: 'Really just a great list here'
    }),
    items: [
        new Item({infatuation: 1}),
        new Item({infatuation: 2}),
        new Item({infatuation: 3}),
    ],
    image_url: 'https://d37219swed47g7.cloudfront.net/media/CACHE/images/images/guides/15-restaurants-perfect-for-guys-night-out/banners/1471440119.33/6524050c9458e3213d7c5cae662bef8a.jpg'
};

module.exports.createEncodedList = function createEncodedList() {
    var list = new List(listFactory);
    var buffer = list.encode();
    var compressed = lzma.compress(buffer.buffer);
    var encoded = base64.encode(compressed).replace('+','-').replace('/','_').replace(/=+$/, '');

    return encoded;
}

module.exports.decodeList = function decodeList (encodedContent) {
    var encodedContent = encodedContent.replace('-','+').replace('_','/');
    switch (encodedContent.length % 4) {
        case 2: encodedContent += '=='; break;
        case 3: encodedContent += '='; break;
    }

    var decoded = base64.decode(encodedContent);
    decoded = decoded.split(',').map(function(value) {
        return parseInt(value);
    });

    var decompressed = lzma.decompress(decoded);
    var list = List.decode(decompressed);

    return list;
}
