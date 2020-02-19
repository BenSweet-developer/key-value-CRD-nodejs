const FileBasedDataStorage = require('./file-based-data-storage');

let fbds = new FileBasedDataStorage();

try {
    fbds.create('abcdefghijklmnopqrstuvwxyzabcedefghijkl', '');
} catch(ex) {
    console.error(ex);
}