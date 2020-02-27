const path = require('path');
const isValidPath = require('is-valid-path');
const fs = require('fs');

class FileBasedDataStorage {

    constructor(filePath = 'data/storage.json') {

        // Validate filePath is valid
        if (!isValidPath(filePath)) {
            throw 'File path is not valid';
        }

        this._filePath = filePath;
    }

    create(key, value, timeToLive = 0) {

        // Check key is valid
        if (!key || typeof key != 'string' || key.toString().length > 32) {
            return { err: 'Not a valid key' };
        }

        // Check value is valid
        if (!value || typeof value !== 'object' || Array.isArray(value) || Buffer.byteLength(JSON.stringify(value)) > 1024 * 16) {
            return { err: 'Not a valid value' };
        }

        // Check timetoLive is a number
        if (timeToLive != 0 && (isNaN(timeToLive) || timeToLive % 1 !== 0)) {
            return { err: 'Not a valid timeToLive' };
        }

        // Check existing file size is exceed 1 GB
        if (fs.existsSync(this._filePath)) {
            
            let fileSize = fs.statSync(this._filePath).size;
            if (fileSize > 1024 * 1024 * 1024) {
                return { err: 'Storage is already reached the limit of 1GB' };
            } else if (fileSize + Buffer.byteLength(JSON.stringify(value)) > 1024 * 1024 * 1024) {
                return { err: 'Storage will be exceed the limit of 1GB' };
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
        let storageData = JSON.parse(fs.readFileSync(this._filePath));
        if (storageData.hasOwnProperty(key)) {
            return { err: 'Key is already exist' };
        }

        // Create a new key value pair to file
        storageData[key] = {value, timeToLive: timeToLive != 0 ? (new Date()).getTime() + timeToLive * 1000 : false};

        // Write object into the file
        fs.writeFileSync(this._filePath, JSON.stringify(storageData));

        return { message: 'Value created sucessfully' };
    }

    read(key) {

        // Check file is exists
        if (!fs.existsSync(this._filePath)) {
            return { err: 'No data available in storage' };
        }

        // Read file data
        let storageData = JSON.parse(fs.readFileSync(this._filePath));

        // Check key is exist and timeToLive
        if (!storageData.hasOwnProperty(key) || (storageData[key].timeToLive !== false && storageData[key].timeToLive < (new Date()).getTime())) {
            return { err: 'Key is not exist' };
        }

        // Return the value of the key
        return { value: storageData[key].value, message: 'Value read sucessfully' };
    }

    delete(key) {

        // Check file is exists
        if (!fs.existsSync(this._filePath)) {
            return { err: 'No data available in storage' };
        }

        // Read the file data
        let storageData = JSON.parse(fs.readFileSync(this._filePath));

        // Check key is exist and timeToLive
        if (!storageData.hasOwnProperty(key) || (storageData[key].timeToLive !== false && storageData[key].timeToLive < (new Date()).getTime())) {
            return { err: 'Key is not exist' };
        }

        // delete the from storageData
        delete storageData[key];

        // store the data to the same file
        fs.writeFileSync(this._filePath, JSON.stringify(storageData));

        return { message: 'Value deleted sucessfully' };
    }
}

module.exports = FileBasedDataStorage;
