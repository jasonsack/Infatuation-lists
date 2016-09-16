const ProtoBuf = require('protobufjs');
const lzma = require('lzma');
const base64 = require('js-base64').Base64;
const path = require('path');
const range = require('lodash/range');

const builder = ProtoBuf.loadProtoFile(path.join(__dirname, '../', 'protobuf', 'list.proto'));
const InfatuationList = builder.build('infatuation.list');

const List = InfatuationList.List;
const Item = InfatuationList.Item;
const Annotation = InfatuationList.Annotation;
const User = InfatuationList.User;

function randomId () {
    const min = 1;
    const max = 1000;
    return Math.floor(Math.random() * max) + min;
}

function createListData (itemsCount) {
    return {
        id: '1',
        label: 'Test List',
        blurb: new Annotation({
            user: new User({
                id: '1',
                name: 'Jason',
            }),
            msg: 'Really just a great list here'
        }),
        items: range(itemsCount).map(() => new Item({infatuation: randomId()})),
        image_url: 'https://d37219swed47g7.cloudfront.net/media/CACHE/images/images/guides/15-restaurants-perfect-for-guys-night-out/banners/1471440119.33/6524050c9458e3213d7c5cae662bef8a.jpg'
    }
}

module.exports.createEncodedList = function createEncodedList (itemsCount) {
    itemsCount = itemsCount || 10;

    const listData = createListData(itemsCount);
    const list = new List(listData);
    const buffer = list.encode().buffer;
    const compressed = lzma.compress(buffer);
    const encoded = base64.encode(compressed).replace('+','-').replace('/','_').replace(/=+$/, '');

    return encoded;
}

module.exports.decodeList = function decodeList (encodedContent) {
    encodedContent = encodedContent.replace('-','+').replace('_','/');
    
    switch (encodedContent.length % 4) {
        case 2: encodedContent += '=='; break;
        case 3: encodedContent += '='; break;
    }

    console.log(base64.decode(encodedContent));
    const decoded = base64.decode(encodedContent).split(',').map(value => parseInt(value));
    const decompressed = lzma.decompress(decoded);
    const list = List.decode(decompressed);

    return list;
}
