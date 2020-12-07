// console.log('sim sim salabim');
"use strict"

const   fs = require('fs'),
        request = require('request'),
        dotenv = require('dotenv');

// Data model
var dataModel = [{
    id: 'string',
    title: 'string',
    topic: 'string',
    year: 1920,
    objectType: 'string'
}];

// GET DATA ====================================================

// API key
dotenv.config();
const API_KEY = process.env.SMITH_KEY;
const API_URL = 'https://api.si.edu/openaccess/api/v1.0/search'
const searchTerm = `unit_code:"NMAAHC"`;
let dataRows = 1000;

// array that we will write into
let dataArray = [];

function dataSearch() {
    let apiRequest = API_URL + "?api_key=" + API_KEY + "&q=" + searchTerm + '&rows=' + dataRows;

    request(apiRequest, (err, res, body) => {
        if (err) {
            throw err;
        }
        // console.log(res.body)

        let apiData = JSON.parse(res.body);
        dataArray.push('data', apiData);
        // console.log(dataArray);
        writeFile('data2', dataArray)
    });
}

function writeFile(fsName, fsData) {
    fs.writeFileSync('data/' + fsName + '.json', JSON.stringify(fsData));
    console.log('*** *** *** *** ***');
    console.log('writeFile complete for', fsName);
};

dataSearch();