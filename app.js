let excelRows;
let processedRows;
let tableEl;
let currentRowIndexToProcess = 0;
let columnNames = [];
let columnNameToEdit = null;
let employeeNamesToGetEmpIds = [];
let fetchEmpIdIndex = 0;

document.getElementById('browse-excel-file')
    .addEventListener('change', (event) => {
        const file = event.target.files[0];

        const fileInfoText = `Name: [${file.name}], Size: [${file.size} bytes], last modified: [${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}]`;

        const reader = new FileReader();
        if (reader.readAsBinaryString) {
            reader.onload = (e) => {
                readExcel(e.target.result);
                createTableAndHeaders();
            };
            reader.readAsBinaryString(file);
        }

        document.getElementsByClassName('navbar-text')[0].innerHTML = fileInfoText;
    }, false);

function readExcel(data) {
    const workbook = XLSX.read(data, { type: 'binary', cellDates: true });

    const firstSheet = workbook.SheetNames[0];
    console.log(firstSheet);

    excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet], { header: 1, dateNF: 'dd/mm/yyyy', defval: '' });
    console.log(excelRows);

    excelRows.forEach(rows => {
        for (let i = 0; i < rows.length; ++i) {
            if (typeof rows[i] === 'string' || rows[i] instanceof String) {
                rows[i] = rows[i].trim();
            }
            if (typeof rows[i] === 'undefined') {
                rows[i] = '';
            }
        }
    });
    console.log(excelRows);
}

function createTableAndHeaders() {
    tableEl = document.createElement('table');
    tableEl.className = "table table-bordered";

    // header
    tableHeadEl = tableEl.createTHead();
    tableHeadEl.className = 'thead-light';

    const row = tableHeadEl.insertRow(-1);
    let headerCell = document.createElement('th');
    headerCell.innerHTML = '1.';
    row.appendChild(headerCell);

    for (let i = 0; i < excelRows[0].length; ++i) {
        headerCell = document.createElement('th');
        const colName = excelRows[0][i].toLowerCase();
        columnNames.push(colName);

        headerCell.name = 'cell-header ' + colName;
        headerCell.id = 'cell-header-id ' + colName;
        headerCell.innerHTML = excelRows[0][i];
        row.appendChild(headerCell);
    }

    const tbdy = document.createElement('tbody');
    tableEl.appendChild(tbdy);

    const excelEl = document.getElementById("excel");
    excelEl.innerHTML = '';
    excelEl.appendChild(tableEl);
}

function processRow(rowIndex, cells) {
    const arr = [];
    processedRows.push(arr);

    const tableBody = document.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow(-1);

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
        process();
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
            const button = document.createElement('button');
            button.className = 'btn btn-info';
            button.name = 'btn-col-rule ' + columnNames[i];
            const t = document.createTextNode(vals.length);
            button.appendChild(t);

            var br = document.createElement("br");
            cellHeader.appendChild(br);
            cellHeader.appendChild(button);
        }
    }
}

function formatDate(date) {
    const formatted = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    return formatted;
}

function getColIndexFromColName(columnName) {
    const tmp = columnName.toLowerCase();
    for (let i = 0; i < excelRows[0].length; ++i) {
        if (tmp === excelRows[0][i].toLowerCase()) {
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

    if (targetName.startsWith('btn-col-rule')) {
        const cellName = targetName.replace('btn-col-rule ', '');

        columnNameToEdit = cellName;

        const colIndex = getColIndexFromColName(cellName);
        console.log(colIndex);


        $('#columnModalLabel').text(`Column: [${excelRows[0][colIndex]}]`);


        const colVals = getColumnValues(colIndex);
        console.log(colVals);

        const vals = getDistinctValuesInCol(colVals);
        console.log(vals);

        emptyOptions('distinct-values-list');

        vals.forEach(el => {
            $('#distinct-values-list').append(`<option value="${el.value}">[${el.value}] - ${el.occurence}x</option>`);
        });


        emptyOptions('rule-from');

        $('#rule-to').val('');

        const existingRules = rules[cellName];

        emptyOptions('existing-rules-list');

        if (existingRules) {
            fillExistingRulesListWith(existingRules);
        }

        $('#columnModal').modal('show');
        return;
    }

    switch (targetName) {

        case 'btn-rule-create-smart': {
            const text = $("#distinct-values-list option:selected").text();
            const optionValues = text.split('[').filter(i => i);

            const array = [];

            console.log(optionValues);
            for (let i = 0; i < optionValues.length; ++i) {
                const arr = optionValues[i].split('] - ');
                array.push({
                    key: arr[0],
                    occurence: parseInt(arr[1].replace('x', ''))
                });
            }

            array.sort(compareOccurence).reverse();

            console.log(array);

            $('#rule-to').val(array[0].key);

            for (let i = 1; i < array.length; ++i) {
                const el = array[i].key;
                $('#rule-from').append(`<option value="${el}">${el}</option>`);
            }

        }
            break;

        case 'export-rules':
            const json = JSON.stringify(rules, null, 2);
            navigator.clipboard.writeText(json).then(() => {
                alert('Rules Data is on Clipboard');
            });
            break;

        case 'process':
            currentRowIndexToProcess = 0;
            processedRows = [];
            process();
            break;

        case 'getEmpId':
            getEmployeeId(document.getElementById('txtempname').value)
                .then(data => console.log(data));
            break;


        case 'btn-rule-add-from': {
            console.log('rule add from');
            const selections = $("#distinct-values-list").val();
            console.log(selections);

            selections.forEach(el => {
                $('#rule-from').append(`<option value="${el}">${el}</option>`);
            })
        }
            break;

        case 'btn-rule-add-to': {
            console.log('rule add to');
            const selections = $("#distinct-values-list").val();
            console.log(selections);
            $('#rule-to').val(selections[0]);
        }
            break;

        case 'btn-rule-create': {
            console.log('rule create');

            const optionValues = [];

            $('#rule-from option').each(function () {
                optionValues.push($(this).val());
            });

            if (columnNameToEdit) {
                if (!rules[columnNameToEdit]) {
                    rules[columnNameToEdit] = [];
                }

                rules[columnNameToEdit].push({
                    from: optionValues,
                    to: $('#rule-to').val()
                });
            }

            $('#rule-to').val('');
            emptyOptions("rule-from");

            fillExistingRulesListWith(rules[columnNameToEdit]);

            console.log(rules[columnNameToEdit]);
        }
            break;

        case 'close-modal':
            columnNameToEdit = null;
            $('#columnModal').modal('hide');
            break;

        case 'close-modal-and-re-process':
            columnNameToEdit = null;
            $('#columnModal').modal('hide');
            currentRowIndexToProcess = 0;
            processedRows = [];
            process();
            break;

        case 'btn-rule-delete': {
            const selectedIndices = $("#existing-rules-list").val();
            console.log(selectedIndices);
            for (let i = 0; i < selectedIndices.length; ++i) {
                selectedIndices[i] = parseInt(selectedIndices[i]);
            }

            for (let i = rules[columnNameToEdit].length - 1; i > -1; --i) {
                if (selectedIndices.includes(i)) {
                    rules[columnNameToEdit].splice(i, 1);
                }
            }

            fillExistingRulesListWith(rules[columnNameToEdit]);
        }
            break;

        case 'openGetEmpIdModal': {
            emptyOptions('column-list');
            for (let i = 0; i < excelRows[0].length; ++i) {
                const colName = excelRows[0][i];
                $('#column-list').append(`<option value="${colName}">[${colName}]</option>`);
            }

            $('#collectEmpIdModal').modal('show');
        }
            break;

        case 'close-modal-empid':
            $('#collectEmpIdModal').modal('hide');
            break;

        case 'begin-getting-emp-ids':
            fetchEmpIdIndex = 0;
            fetchEmpId();
            break;

        case 'export-to-excel-empids': {

            var wb = XLSX.utils.book_new();
            wb.Props = {
                Title: "TAG Excel Importer",
                Subject: "Employee Ids",
                Author: "TCS",
                CreatedDate: new Date()
            };

            const sheetName = columnNameToEdit.replace('[', '').replace(']', '');

            wb.SheetNames.push(sheetName);

            const tempArr = [{ empid: 'EmployeeId', name: 'Name' }, ...employeeNamesToGetEmpIds];

            // var ws_data = [['hello', 'world']];
            // var ws_data = [['hello', 'world'], ['hello', 'world']];
            // var ws_data = [[employeeNamesToGetEmpIds.map(x => [x.name])]];
            var ws_data = tempArr.map(x => [x.empid, x.name]);

            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets[sheetName] = ws;

            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `employeeids-in-column-${columnNameToEdit.toLowerCase()}.xlsx`);
        }
            break;
    }
});

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

function fetchEmpId() {

    const emp = employeeNamesToGetEmpIds[fetchEmpIdIndex];
    emp.empid = '[GETTING]';

    fillColumnValues();

    getEmployeeId(emp.name)
        .then(data => {
            console.log(data);

            const obj = JSON.parse(data);

            if (obj.users && obj.users[0]) {
                employeeNamesToGetEmpIds[fetchEmpIdIndex].empid = obj.users[0].employee_id;
            } else {
                employeeNamesToGetEmpIds[fetchEmpIdIndex].empid = '???';
            }

            fillColumnValues();

            fetchEmpIdIndex++;
            if (fetchEmpIdIndex < employeeNamesToGetEmpIds.length) {
                fetchEmpId();
            }

        });
}

$("#column-list").change(function () {
    columnNameToEdit = '';
    $("#column-list option:selected").each(function () {
        columnNameToEdit += $(this).text();
    });

    const colIndex = getColIndexFromColName(columnNameToEdit.replace('[', '').replace(']', ''));
    if (!isNaN(colIndex)) {
        let columnValues = getColumnValues(colIndex);
        const distValues = getDistinctValuesInCol(columnValues);
        columnValues = distValues.map(x => x.value);

        employeeNamesToGetEmpIds.length = 0;

        columnValues.forEach(el => {
            employeeNamesToGetEmpIds.push({
                name: el,
                empid: '-'
            });
        });
        fillColumnValues();
    }
});

function fillColumnValues() {
    emptyOptions('column-values');

    let cnt = 0;
    employeeNamesToGetEmpIds.forEach(emp => {
        $('#column-values').append(`<option value="${cnt++}">[${emp.empid}] - [${emp.name}]</option>`);
    });
}

function fillExistingRulesListWith(rules) {
    emptyOptions("existing-rules-list");

    let cnt = 0;
    rules.forEach(el => {
        $('#existing-rules-list').append(`<option value="${cnt++}">[${el.from}] -> [${el.to}]</option>`);
    });
}

function emptyOptions(elementId) {
    document.getElementById(elementId).options.length = 0;
}

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

Promise.all(['data/rules.json', 'data/secret.json'].map(url => fetch(url)))
    .then(resp => Promise.all(resp.map(r => r.json())))
    .then(data => {
        rules = data[0];
        secret = data[1];
    });
