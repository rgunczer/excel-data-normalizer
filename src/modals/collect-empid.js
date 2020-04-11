'use strict';


Vue.component('collect-empid-modal', {

    template: `
<div class="modal fade" id="collectEmpIdModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="collectEmpIdModalLabel">Fetch Emplyee Ids</h5>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="row">
                        Select Column:
                        <select id="column-list" class="form-control"></select>
                    </div>
                    <div class="row">
                        Column Values:
                        <select id="column-values" size="20" class="form-control mr-sm-2"></select>
                    </div>
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-4">
                            <button type="button" class="btn btn-info btn-sm" id="begin-getting-emp-ids" name="begin-getting-emp-ids">
                                <span>
                                    <i class="fas fa-play"></i>
                                    Begin Getting Employee Ids
                                </span>
                            </button>
                        </div>
                        <div class="col-8">
                            <input type="text" id="txt-api-key" class="form-control mr-sm-2" placeholder="api key">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="export-to-excel-empids" name="export-to-excel-empids">
                    <span>
                        <i class="fas fa-file-download"></i>
                        Export To Excel
                    </span>
                </button>
                <button type="button" class="btn btn-secondary" id="close-modal-empid" name="close-modal-empid">Close</button>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            columnNameToEdit: null,
            employeeNamesToGetEmpIds: [],
            fetchEmpIdIndex: 0,
            columnNames: []
        };
    },
    methods: {

    // $("#column-list").change(function () {
    //     columnNameToEdit = '';
    //     $("#column-list option:selected").each(function () {
    //         columnNameToEdit += $(this).text();
    //     });

    //     const colIndex = columnNames.indexOf(removeFirstLastChar(columnNameToEdit));
    //     if (!isNaN(colIndex)) {
    //         let columnValues = getColumnValues(colIndex, processedRows);
    //         const distValues = getDistinctValuesInCol(columnValues);
    //         columnValues = distValues.map(x => x.value);

    //         employeeNamesToGetEmpIds.length = 0;

    //         columnValues.forEach(el => {
    //             employeeNamesToGetEmpIds.push({
    //                 name: el,
    //                 empid: '-'
    //             });
    //         });
    //         fillColumnValues();
    //     }
    // });

    fillColumnValues() {
        ui.emptyOptions('column-values');

        let cnt = 0;
        employeeNamesToGetEmpIds.forEach(emp => {
            $('#column-values').append(`<option value="${cnt++}">[${emp.empid}] - [${emp.name}]</option>`);
        });
    },
    fetchEmpId() {

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

    //     switch (targetName) {
    //         case 'openGetEmpIdModal': {
    //             columnNames = getColumnNames(originalRows);

    //             ui.emptyOptions('column-list');
    //             columnNames.forEach(colName => {
    //                 $('#column-list').append(`<option value="${colName}">[${colName}]</option>`);
    //             })

    //             $('#txt-api-key').val(secret.apikey);

    //             $('#collectEmpIdModal').modal('show');
    //         }
    //             break;

    //         case 'close-modal-empid':
    //             $('#collectEmpIdModal').modal('hide');
    //             break;

    //         case 'begin-getting-emp-ids':
    //             fetchEmpIdIndex = 0;
    //             secret.apikey = $('#txt-api-key').val();
    //             fetchEmpId();
    //             break;

    //         case 'getEmpId':
    //             api.getEmployeeId(document.getElementById('txtempname').value)
    //                 .then(data => console.log(data));
    //             break;

    //         case 'export-to-excel-empids': {
    //             const fileName = `employeeids-in-column-${columnNameToEdit.toLowerCase()}.xlsx`
    //             const sheetName = removeFirstLastChar(columnNameToEdit);
    //             const tempArr = [{ empid: 'EmployeeId', name: 'Name' }, ...employeeNamesToGetEmpIds];
    //             const data = tempArr.map(x => [x.empid, x.name]);

    //             excel.write(fileName, sheetName, data);
    //         }
    //             break;
    //     }
    }
});
