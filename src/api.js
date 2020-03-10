'use strict';

const api = (function () {

    function getEmployeeId(employeeName) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', secret.empidurl, true);

            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('x-api-key', secret.apikey);

            xhr.onload = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            }
            const q = encodeURIComponent(employeeName);
            xhr.send(`query=${q}`);
        });
    }

    function loadJson(urls, callback) {
        Promise.all(urls.map(url => fetch(url)))
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(jsonArray => callback(jsonArray));
    }

    function loadText(urls, callback) {
        Promise.all(urls.map(url => fetch(url)))
            .then(responses => Promise.all(responses.map(response => response.text())))
            .then(jsonArray => callback(jsonArray));
    }

    return {
        getEmployeeId,
        loadJson,
        loadText
    };

})();
