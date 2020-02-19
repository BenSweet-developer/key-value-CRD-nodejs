const path = require('path');
const fs = require('fs');

class FileBasedDataStorage {

    constructor(filePath = 'data/storage.json') {

        this._filePath = filePath;
    }

    create(key, value, timeToLive = false) {

        // Check key is valid
        if (!key || key.toString().length > 32) {
            throw 'Not a valid key';
        }

        // Check value is valid
        if (!value || typeof value !== 'object' || Array.isArray(value) || Buffer.byteLength(JSON.stringify(value)) > 1024 * 16) {
            throw 'Not a valid value';
        }

        // Check timetoLive is a number
        if (timeToLive !== false && (isNaN(timeToLive) || timeToLive <= 0 || timeToLive % 1 !== 0)) {
            throw 'Not a valid timeToLive';
        }

        // Check existing file size is exceed 1 GB
        if (fs.existsSync(this._filePath)) {
            
            let fileSize = fs.statSync(this._filePath).size;
            if (fileSize > 1024 * 1024 * 1024) {
                throw 'File size is already reached the limit';
            } else if (fileSize + Buffer.byteLength(JSON.stringify(value)) > 1024 * 1024 * 1024) {
                throw 'File size will be exceed the limit';
            }
        } else {
            // Make directory
            if (this._filePath.split('/').length > 1) {
                fs.mkdirSync(path.dirname(this._filePath), {recursive: true});
            }
            // Create a new file
            fs.writeFileSync(this._filePath, '{}');
        }

        // Check key is alread exist
        let storage = fs.readFileSync(this._filePath);
        let storageData = {};
        if (storage.length > 0) {
            storageData = JSON.parse(storage);
        }
        if (storageData.hasOwnProperty(key)) {
            throw 'Key is already exist';
        }

        // Create a new key value pair to file
        storageData[key] = {value, timeToLive};

        // Write object into the file
        fs.writeFileSync(this._filePath, JSON.stringify(storageData));
    }
}

module.exports = FileBasedDataStorage;