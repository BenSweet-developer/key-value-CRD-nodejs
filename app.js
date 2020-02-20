// Require file-based-data-storage module
const FileBasedDataStorage = require('./file-based-data-storage');


// Initialize class with optional filePath parameter
let fbds = new FileBasedDataStorage('');


// Create a key value pair. Last parameter is timeToLive which is optional
let response_create = fbds.create('profile2', {name: 'benny1', job: 'IT'}, 30);
// if response has error then print the error, otherwise print success message
if (response_create.err) {
    console.error(response_create.err);
} else {
    console.log('Value created successfully');
}


// Read a value by key
let response_read = fbds.read('profile2');
if (response_read.err) {
    console.error(response_read.err);
} else {
    console.log('Value => ', response_read.value);
}


// Delete a value by key
let response_delete = fbds.delete('profile2');
if (response_delete.err) {
    console.error(response_delete.err);
} else {
    console.log('Value deleted successfully');
}