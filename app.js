const FileBasedDataStorage = require('./file-based-data-storage');

let fbds = new FileBasedDataStorage();

try {
    fbds.create('profile2', {name: 'benny', job: 'IT'}, 300);
} catch(ex) {
    console.error(ex);
}