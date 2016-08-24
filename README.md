# infatuation-lists

### Install dependencies

Make sure you have node & npm installed and then:

```
npm install
```

### Create Encoded List

Create a base64 encoeded, lzma compressed protobuffer list. itemsCont defaults to 10 if not passed

```shell
node index.js --create <Integer: itemsCount>
```

### Decode list

decode & decompress a protobuffer list

```
node index.js <encoded_list>
```
