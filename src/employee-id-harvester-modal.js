'use strict';

const employeeIdHarvesterModal = (function () {

    let columnNameToEdit = null;
    let employeeNamesToGetEmpIds = [];
    let fetchEmpIdIndex = 0;

    $("#column-list").change(function () {
        columnNameToEdit = '';
        $("#column-list option:selected").each(function () {
            columnNameToEdit += $(this).text();
        });

        const colIndex = columnNames.indexOf(removeFirstLastChar(columnNameToEdit));
        if (!isNaN(colIndex)) {
            let columnValues = getColumnValues(colIndex, processedRows);
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
        ui.emptyOptions('column-values');

        let cnt = 0;
        employeeNamesToGetEmpIds.forEach(emp => {
            $('#column-values').append(`<option value="${cnt++}">[${emp.empid}] - [${emp.name}]</option>`);
        });
    }

    function fetchEmpId() {

        const emp = employeeNamesToGetEmpIds[fetchEmpIdIndex];
        emp.empid = '[GETTING]';

        fillColumnValues();

        api.getEmployeeId(emp.name)
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

    function handle(targetName) {
        switch (targetName) {
            case 'openGetEmpIdModal': {
                ui.emptyOptions('column-list');
                columnNames.forEach(colName => {
                    $('#column-list').append(`<option value="${colName}">[${colName}]</option>`);
                })

                $('#txt-api-key').val(secret.apikey);

                $('#collectEmpIdModal').modal('show');
            }
                break;

            case 'close-modal-empid':
                $('#collectEmpIdModal').modal('hide');
                break;

            case 'begin-getting-emp-ids':
                fetchEmpIdIndex = 0;
                secret.apikey = $('#txt-api-key').val();
                fetchEmpId();
                break;

            case 'getEmpId':
                api.getEmployeeId(document.getElementById('txtempname').value)
                    .then(data => console.log(data));
                break;

            case 'export-to-excel-empids': {
                const fileName = `employeeids-in-column-${columnNameToEdit.toLowerCase()}.xlsx`
                const sheetName = removeFirstLastChar(columnNameToEdit);
                const tempArr = [{ empid: 'EmployeeId', name: 'Name' }, ...employeeNamesToGetEmpIds];
                const data = tempArr.map(x => [x.empid, x.name]);

                excel.write(fileName, sheetName, data);
            }
                break;
        }
    }

    return {
        handle
    };

})();
