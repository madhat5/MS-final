// console.log('sim sim salabim');
"use strict"

const   fs = require('fs');

// Data model
var dataModel = [{
    id: 'string',
    title: 'string',
    topic: 'string',
    year: 1920,
    objectType: 'string'
}];

// FINALS Data model
var dataModel = [{
    topic: {
        objectCount: 123,
        topicObjects: [{
            id: 'string',
            title: 'string',
            allTopics: ['string'],
            year: 1920,
            objectType: 'string',
            objectIcon: 'path',
            objectDescription: "string (notes key in data.json)",
            displayStatus: true,
        }, {
            id: 'string',
            title: 'string',
            allTopics: ['string'],
            year: 1920,
            objectType: 'string',
            objectIcon: 'path',
            objectDescription: "string (notes key in data.json)",
            displayStatus: false,
        }]
    }
}];

// CLEAN DATA ====================================================

let json = require('./data/data.json');
// console.log(json[1].response.rows)
let dataObj = json[1].response.rows;
// console.log(dataObj.length);

// clean data
let cleanData = [];

dataObj.forEach((el, i) => {
    // console.log(el)
    // console.log(i)

    // Turn dates array years into integers
    let cleanYear = el.content.indexedStructured.date
    // console.log(cleanYear);

    // cleanYear.forEach((yr, index) => {
    //     if (yr === 'undefined') {
    //         console.log('err')
    //     }
    //     console.log(i)
    //     // console.log(parseInt(yr, 10))
    //     // yr.replace(/s/,"");
    // });

    // https://gomakethings.com/converting-strings-to-numbers-with-vanilla-javascript/

    cleanData.push({
        id: el.id,
        title: el.title,
        topic: el.content.indexedStructured.topic,
        // year: el.content.date[0].content, DON'T USE?
        // year: cleanYear,
        year: el.content.indexedStructured.date,
        objectType: el.content.indexedStructured.object_type
    });
});

function writeFile(fsName, fsData) {
    fs.writeFileSync('data/' + fsName + '.json', JSON.stringify(fsData));
    console.log('*** *** *** *** ***');
    console.log('writeFile complete for', fsName);
};

// writeFile('cleanData', cleanData);

// ================================================

function getTopicObject(arr) {
    var obj = {};

    arr.forEach(i => {
        i.topic.forEach(t => {
            if (!obj.hasOwnProperty(t)) {
                obj[t] = 1
            } else {
                obj[t] += 1;
            }
        });
    });

    return obj;
}

let tempDataObj = getTopicObject(cleanData);
let tempDataArr = []
tempDataArr.push(tempDataObj)
writeFile('rawGraphsData ', tempDataArr);