const FileBasedDataStorage = require('./file-based-data-storage');

let fbds = new FileBasedDataStorage();

try {
    fbds.create('profile', {name: 'benny', job: 'IT'});
} catch(ex) {
    console.error(ex);
}