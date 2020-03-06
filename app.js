let excelRows;
let processedRows;
let tableEl;
let currentRowIndexToProcess = 0;
let columnNames = [];

function handleFileSelect(event) {
    const file = event.target.files[0]; // FileList object

    const html = `Name: [${file.name}], Type: [${file.type}], Size: [${file.size} bytes], last modified: [${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}]`;

    const reader = new FileReader();
    if (reader.readAsBinaryString) {
        reader.onload = (e) => {
            processExcel(e.target.result);
        };
        reader.readAsBinaryString(file);
    }

    document.getElementById('excel-file-stat').innerHTML = html;
}

document.getElementById('files')
    .addEventListener('change', handleFileSelect, false);


function processExcel(data) {
    const workbook = XLSX.read(data, { type: 'binary', cellDates: true });

    const firstSheet = workbook.SheetNames[0];
    console.log(firstSheet);

    excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet], { header: 1, dateNF: 'dd/mm/yyyy' });
    console.log(excelRows);

    tableEl = document.createElement('table');

    // header
    const row = tableEl.insertRow(-1);
    let headerCell = document.createElement('th');
    headerCell.innerHTML = '1.';
    row.appendChild(headerCell);

    for (let i = 0; i < excelRows[0].length; ++i) {
        headerCell = document.createElement('th');
        const colName = excelRows[0][i].toLowerCase().trim();
        excelRows[0][i] = colName;
        columnNames.push(colName);

        headerCell.name = 'cell-header ' + colName;
        headerCell.id = 'cell-header-id ' + colName;
        headerCell.innerHTML = excelRows[0][i];
        row.appendChild(headerCell);
    }

    const excelEl = document.getElementById("excel");
    excelEl.innerHTML = '';
    excelEl.appendChild(tableEl);
}

function processRow(rowIndex, cells) {
    const arr = [];
    processedRows.push(arr);

    const row = tableEl.insertRow(-1);

    let cell = row.insertCell(-1);
    cell.innerHTML = `${rowIndex + 1}.`;

    for (let i = 0; i < cells.length; ++i) {
        cell = row.insertCell(-1);
        let cellValue = (cells[i] instanceof Date) ? formatDate(cells[i]) : cells[i];

        cellValue = (typeof cellValue === 'undefined') ? '' : cellValue;

        const colName = excelRows[0][i].toLowerCase();
        const ruleArr = rules[colName];

        if (ruleArr) {
            for (let ii = 0; ii < ruleArr.length; ++ii) {
                const rule = ruleArr[ii];
                if (rule.from.includes(cellValue)) {
                    cellValue = rule.to;
                    break;
                }
            }
        }

        arr.push(cellValue);
        cell.innerHTML = cellValue;
    }
}

function process() {
    ++currentRowIndexToProcess;

    if (currentRowIndexToProcess < excelRows.length) {
        processRow(currentRowIndexToProcess, excelRows[currentRowIndexToProcess]);
        setTimeout(process, 1);
    } else {
        createStat();
    }
}

function createStat() {
    for (let i = 0; i < columnNames.length; ++i) {
        const colVals = getColumnValues(i);
        // console.log(colVals);

        const vals = getDistinctValuesInCol(colVals);
        console.log(vals);

        const cellHeader = document.getElementById('cell-header-id ' + columnNames[i]);
        if (cellHeader) {
            var span = document.createElement('span');
            span.innerHTML = `<br>[${vals.length}]`;
            cellHeader.appendChild(span);
        }
    }
}

function formatDate(date) {
    const formatted = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    return formatted;
}

function getColIndexFromColName(columnName) {
    for (let i = 0; i < excelRows[0].length; ++i) {
        if (columnName === excelRows[0][i].toLowerCase()) {
            return i;
        }
    }
}

function getColumnValues(colIndex) {
    const vals = [];
    for (let i = 1; i < processedRows.length; ++i) {
        vals.push(processedRows[i][colIndex]);
    }
    return vals;
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

document.addEventListener('click', event => {
    const targetName = event.target.name;
    console.log('click: ', targetName);

    if (!targetName) {
        return;
    }

    if (targetName.startsWith('cell-header')) {
        const cellName = targetName.replace('cell-header ', '');
        console.log(cellName);

        const colIndex = getColIndexFromColName(cellName);
        console.log(colIndex);

        const colVals = getColumnValues(colIndex);
        console.log(colVals);

        const vals = getDistinctValuesInCol(colVals);
        console.log(vals);
        return;
    }

    switch (targetName) {
        case 'process':
            currentRowIndexToProcess = 0;
            processedRows = [];
            process();
            break;

        case 'getEmpId':
            getEmployeeId(document.getElementById('txtempname').value)
                .then(data => console.log(data));
            break;
    }
});


function getEmployeeId(employeeName) {

    return new Promise((resolve, reject) => {

        const par = encodeURIComponent(employeeName);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", secret.empidurl, true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("x-api-key", secret.apikey);

        xhr.onreadystatechange = () => { // Call a function when the state changes.
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Request finished. Do processing here.
                resolve(xhr.responseText);
            } else {
                console.log('todo!?')
            }
        }
        xhr.send("query=" + par);

    });
}


fetch('data/rules.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        rules = data;
    });

fetch('data/secret.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        secret = data;
    });
