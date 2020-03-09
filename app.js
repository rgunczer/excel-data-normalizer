let excelRows;
let processedRows;
let tableEl;

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
                excelRows = excel.read(e.target.result);
                preProcessRawExcelData(excelRows);
                createTableAndHeaders();
            };
            reader.readAsBinaryString(file);
        }

        document.getElementsByClassName('navbar-text')[0].innerHTML = fileInfoText;
    }, false);

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

        case 'process': {
            const icon = document.getElementById('processing-rocket-icon');
            icon.classList.add('fa-spin');

            processor = Processor(excelRows, rules);

            processor.run().then(result => {
                processedRows = result;
                icon.classList.remove('fa-spin');
            });
        }
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
            const fileName = `employeeids-in-column-${columnNameToEdit.toLowerCase()}.xlsx`
            const sheetName = columnNameToEdit.replace('[', '').replace(']', '');
            const tempArr = [{ empid: 'EmployeeId', name: 'Name' }, ...employeeNamesToGetEmpIds];
            const data = tempArr.map(x => [x.empid, x.name]);

            excel.save(fileName, sheetName, data);
        }
            break;
    }
});

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

api.load(arr => {
    rules = arr[0];
    secret = arr[1];
});
