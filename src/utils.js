'use strict';

function formatDate(date) {
    const formatted = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    return formatted;
}

function preProcessRawExcelData(xlsRows) {
    xlsRows.forEach(rows => {
        for (let i = 0; i < rows.length; ++i) {
            if (typeof rows[i] === 'string' || rows[i] instanceof String) {
                rows[i] = rows[i].trim();
            }
            if (typeof rows[i] === 'undefined') {
                rows[i] = '';
            }
        }
    });
}

function compareOccurence(a, b) {
    const aValue = a.occurence;
    const bValue = b.occurence;

    if (aValue < bValue) {
        return -1;
    }
    if (aValue > bValue) {
        return 1;
    }
    return 0;
}

function getComparatorFn(propName) {

    return function compare(a, b) {
        const aValue = a[propName].toLowerCase();
        const bValue = b[propName].toLowerCase();

        if (aValue < bValue) {
            return -1;
        }
        if (aValue > bValue) {
            return 1;
        }
        return 0;
    }
}


function compare(a, b) {
    const aValue = a.value.toLowerCase();
    const bValue = b.value.toLowerCase();

    if (aValue < bValue) {
        return -1;
    }
    if (aValue > bValue) {
        return 1;
    }
    return 0;
}

function splitColumnValue(value, regExpStr) {
    const arr = value.split(new RegExp(regExpStr));
    arr[0] = arr[0].trim();
    if (arr.length > 1) {
        arr[1] = arr[1].trim();
    } else {
        arr[1] = '';
    }
    return arr;
}

function splitColumn(sourceValues, regExpStr) {
    const resultValues = [];
    sourceValues.forEach(val => {
        const arr = splitColumnValue(val, regExpStr);
        resultValues.push([val, arr[0], arr[1]]);
    });
    return resultValues;
}

function getPipeline() {
    const str = localStorage.getItem('pipeline');
    if (str) {
        const pipeline = JSON.parse(str);
        return pipeline;
    }
    return null;
}

function getOriginalColumnNames(rows) {
    const columns = [];
    for (let i = 0; i < rows[0].length; ++i) {
        const colName = rows[0][i];
        columns.push(colName);
    }
    return columns;
}

function getColumnNames(rows) {
    const pipeline = getPipeline();
    const columns = [];
    for (let i = 0; i < rows[0].length; ++i) {
        const colName = rows[0][i];
        if (pipeline) {
            if (pipeline[colName]) {
                const config = pipeline[colName];
                if (!config['hide-original-column']) {
                    columns.push(colName);
                }
                config['new-column-names'].forEach(col => {
                    columns.push(col);
                })
                continue;
            }
        }
        columns.push(colName);
    }
    return columns;
}

function getColumnValues(colIndex, rows) {
    const arr = [];
    for (let i = 1; i < rows.length; ++i) {
        arr.push(rows[i][colIndex]);
    }
    return arr;
}

function getDistinctValuesInCol(colValues) {
    const obj = {};

    colValues.forEach(element => {
        let el = element;
        if (typeof el === 'string' || el instanceof String) {
            el = element.trim();
        }
        if (obj.hasOwnProperty(el)) {
            obj[el] = obj[el] + 1
        } else {
            obj[el] = 1;
        }
    });

    const sortable = [];
    for (let key in obj) {
        sortable.push({
            value: key,
            occurence: obj[key]
        });
    }

    sortable.sort(compare);

    return sortable;
}

function getDistinctValuesInColumn(colName, columnNames, dataRows) {
    const colIndex = columnNames.indexOf(colName);
    const colVals = getColumnValues(colIndex, dataRows);
    const distVals = getDistinctValuesInCol(colVals);
    return distVals;
}

function removeFirstLastChar(str) {
    return str.slice(1, -1);
}

function isString(str) {
    return Object.prototype.toString.call(str) === "[object String]"
}
