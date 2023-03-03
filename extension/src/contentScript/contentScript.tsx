import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Note from './note'
import HtmlNote from './htmlNote';

console.log('Chrome Extension Running');
const body = document.querySelector('body');
const app = document.createElement('div');

app.id = 'react-root'

if (body) {
  body.prepend(app)
}

const container = document.getElementById('react-root');
const root = createRoot(container);

root.render(<><Note /><HtmlNote /></>);

export async function getChromeItem(key: string) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get([key], function(fetchedData) {
        if (typeof fetchedData.user_id !== 'undefined') {
          const user_id = JSON.parse(fetchedData.user_id).value;
          resolve(user_id);
        }
        reject()
      })
    }
    catch (ex) {
      console.log(ex);
    }
  })
}

export async function getCollectionId(key: string) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get([key], function(fetchedData) {
        if (typeof fetchedData.collection_id !== 'undefined') {
          const collection_id = JSON.parse(fetchedData.collection_id).value;
          resolve(collection_id);
        }
        reject()
      })
    }
    catch (ex) {
      console.log(ex);
    }
  })
}

export async function getUrl(key: string) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get([key], function(fetchedData) {
        if (typeof fetchedData.url !== 'undefined') {
          const url = JSON.parse(fetchedData.url).value;
          resolve(url);
        }
        reject()
      })
    }
    catch (ex) {
      console.log(ex);
    }
  })
}

export function setChromeItem(givenKey: string, value: any) {
  var key = givenKey,
        testPrefs = JSON.stringify({
            value
        });
    var jsonfile = {};
    jsonfile[key] = testPrefs;
    chrome.storage.sync.set(jsonfile, function () {
        console.log('Saved', key, testPrefs);
    });
}

export function removeChromeItem(givenKey: string) {
    chrome.storage.sync.remove(givenKey, function () {
        console.log('Removed', givenKey);
    });
}