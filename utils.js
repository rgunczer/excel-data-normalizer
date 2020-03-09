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
    console.log(xlsRows);
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

function getColumnValues(colIndex) {
    const vals = [];
    for (let i = 1; i < processedRows.length; ++i) {
        vals.push(processedRows[i][colIndex]);
    }
    return vals;
}

function getDistinctValuesInCol(colValues) {
    const obj = {};

    colValues.forEach(element => {
        let = el = element;
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
        sortable.push({ value: key, occurence: obj[key] });
    }

    sortable.sort(compare);

    return sortable;
}

function getColIndexFromColName(columnName) {
    const tmp = columnName.toLowerCase();
    for (let i = 0; i < excelRows[0].length; ++i) {
        if (tmp === excelRows[0][i].toLowerCase()) {
            return i;
        }
    }
}
