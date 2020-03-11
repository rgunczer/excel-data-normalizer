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

function getColumnNames(rows) {
    const arr = [];
    for (let i = 0; i < rows[0].length; ++i) {
        arr.push(rows[0][i]);
    }
    return arr;
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
