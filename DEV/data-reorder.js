// console.log('sim sim salabim');
"use strict"

const fs = require('fs');
const { isContext } = require('vm');

// FINALS Data model
var dataModel = [{
    onDisplay: {
        topicActual: [{
            objectTypeActual: [{
                objectsActual: [{
                    id: 'string',
                    title: 'string',
                    allTopics: ['string'],
                    year: 1920,
                    objectType: 'string',
                    // objectIcon: 'path',
                    objectDescription: "string (notes key in data.json)",
                    displayStatus: true, // (onPhysicalExhibit)
                }]
            }]
        }]
    },
    inStorage: {
        topicActual: [{
            objectTypeActual: [{
                objectsActual: [{
                    id: 'string',
                    title: 'string',
                    allTopics: ['string'],
                    year: 1920,
                    objectType: 'string',
                    // objectIcon: 'path',
                    objectDescription: "string (notes key in data.json)",
                    displayStatus: false, // (onPhysicalExhibit)
                }]
            }]
        }]
    }
}];

// CLEAN DATA ====================================================

let json = require('./data/data2.json');
// console.log(json[1].response.rows)
let dataObj = json[1].response.rows;
// console.log(dataObj);
// console.log(dataObj[10].content.indexedStructured.onPhysicalExhibit);
// console.log(dataObj.length);

// clean data
let cleanData = [];

dataObj.forEach((el, i) => {
    // console.log(el)
    // console.log(i)
    // console.log(el.content.indexedStructured.onPhysicalExhibit)

    let displayBool;

    if (el.content.indexedStructured.onPhysicalExhibit == undefined) {
        displayBool = false
    } else {
        displayBool = true
    }
    // console.log(displayBool)

    cleanData.push({
        id: el.id,
        title: el.title,
        topic: el.content.indexedStructured.topic,
        year: el.content.indexedStructured.date,
        objectType: el.content.indexedStructured.object_type,
        objectDescription: el.content.freetext.notes[0].content,
        objectType: el.content.indexedStructured.object_type,
        displayStatus: displayBool
    });
});
// console.log(cleanData)
// console.log(cleanData.length)
// writeFile('cleanData2', cleanData);

function writeFile(fsName, fsData) {
    fs.writeFileSync('data/' + fsName + '.json', JSON.stringify(fsData));
    console.log('*** *** *** *** ***');
    console.log('writeFile complete for', fsName);
};

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

function organizeTheseDamnObjects(inObj){
    let superSet = {
        "name":"topics",
        "children":[]
    };
    let topics = superSet.children;
    inObj.forEach((item) =>{
        item.topic.forEach(t =>{

            let indexOfTopic = getIndexByName(topics, t)
            if(indexOfTopic === -1){
                topics.push({
                    name: t,
                    children:[]
                })
                indexOfTopic = topics.length - 1;
            }
            
            let objectTypes = topics[indexOfTopic].children;
            item.objectType.forEach(o =>{
                let indexOfType = getIndexByName(objectTypes, o, true)
                if(indexOfType === -1){
                    objectTypes.push({
                        name: o,
                        children:[]
                    })
                }
            });
        });
        // i.children.forEach(o => {
        //     console.log("\t" + o.name)
        // })
    });

    // superSet.children.forEach(t => {
    //     console.log(t.name)
    // })
}

function getIndexByName(arr, name, tabbed = false){
    let tabChar = tabbed?"\t" : "";
    if(arr.length === 0){
        return -1
    }
    else{
        console.log(tabChar + "Topic being checked: " + name)
        for(let i = 0; i < arr.length; i++){
            let o = arr[i];
            console.log(tabChar + o.name + " at Current Index: " + i );

            if(o.name.localeCompare(name) == 0)
            {
                console.log(tabChar + "Does not adding" + (tabbed?"\n":""));
                return i;
            }
            
        }
        console.log(tabChar + "Being added" + (tabbed?"\n":""));
        return -1;
    }  
}



// let tempDataObj = getTopicObject(cleanData2);
// let tempDataArr = []
// tempDataArr.push(tempDataObj)
// console.log(tempDataArr.length)

// writeFile('sortedData ', tempDataArr);
organizeTheseDamnObjects(cleanData)