// Require file-based-data-storage module
const FileBasedDataStorage = require('./file-based-data-storage');


// Initialize class with optional filePath parameter
let fbds = new FileBasedDataStorage();


// Create a key value pair. Last parameter is timeToLive which is optional
let responseCreate = fbds.create('profile', {name: 'Benny Sweetson M', job: 'IT'}, 30);

// if response has error then print the error, otherwise print message.
if (responseCreate.err) {
    console.error(responseCreate.err);
} else {
    console.log(responseCreate.message);
}


// Read a value by key
let responseRead = fbds.read('profile');

// if response has error then print the error, otherwise print message.
if (responseRead.err) {
    console.error(responseRead.err);
} else {
    console.log('Value => ', responseRead.value);
}


// Delete a value by key
let responseDelete = fbds.delete('profile');

// if response has error then print the error, otherwise print message.
if (responseDelete.err) {
    console.error(responseDelete.err);
} else {
    console.log(responseDelete.message);
}
