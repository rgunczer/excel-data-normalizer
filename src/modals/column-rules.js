'use strict';

Vue.component('column-rules-modal', {
    template: `
<div class="modal fade" id="columnModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl" style="min-width: 95%;">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="columnModalLabel"></h5>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-3">
                        <div class="form-row">
                            <div class="col-md-3">
                                <label for="db-table-values-list">DB Table</label>
                            </div>
                            <div class="col-md-5">
                                <select id="db-table-list" class="form-control form-control-sm"></select>
                            </div>
                            <div class="col-md-3">
                                <div class="btn-group btn-group-sm" role="group">
                                    <button type="button" id="set-excel-to-db-table-mapping" name="set-excel-to-db-table-mapping" class="btn btn-info btn-sm">
                                        Set
                                    </button>
                                    <button type="button" id="del-excel-to-db-table-mapping" name="del-excel-to-db-table-mapping" class="btn btn-info btn-sm">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    <button class="btn btn-info btn-sm" data-toggle="collapse" data-target="#collapseVisibleFields">
                                        <i class="fas fa-filter"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="collapse" id="collapseVisibleFields">
                            </div>
                            <div class="overflow-auto" style="height: 500px;">
                                <table id="db-table-rows" class="table table-bordered table-hover table-sm">
                                    <thead class="thead-light"></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-1">
                        <div class="form-group" style="text-align: center;">
                            <label>DB Mapping</label>
                            <div class="form-group" style="text-align: center;">
                                <select id="db-columns-list" class="form-control rule form-control-sm"></select>
                            </div>
                            <button id="btn-mapping-smart" name="btn-mapping-smart" class="btn btn-info btn-sm">
                                <span>
                                    <i class="fas fa-bolt"></i>Smart
                                </span>
                            </button>
                            <button id="btn-mapping-smart-empid" name="btn-mapping-smart-empid" class="btn btn-info btn-sm" style="margin-top: 6px;">
                                <span>
                                    <i class="fas fa-bolt"></i>Smart EmpId
                                </span>
                            </button>
                        </div>
                        <div class="form-group" style="text-align: center;">
                            <button id="btn-mapping-add" name="btn-mapping-add" class="btn btn-info btn-sm">
                                <span>
                                    <i class="fas fa-link"></i>Map
                                </span>
                            </button>
                        </div>
                        <div class="form-group" style="text-align: center;">
                            <button id="btn-mapping-delete" name="btn-mapping-delete" class="btn btn-info btn-sm">
                                <span>
                                    <i class="fas fa-trash-alt"></i>Delete
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="form-group">
                            <label id="label-distinct-values" for="distinct-values-list">Distinct Values</label>
                            <select id="distinct-values-list" class="form-control rule overflow-auto" size="20" multiple></select>
                        </div>
                    </div>
                    <div class="col-1">
                        <form>
                            <div class="form-group">
                                <label>Rule</label>
                                <div class="form-group" style="text-align: center;">
                                    <button type="button" class="btn btn-info btn-sm" id="btn-rule-create-smart" name="btn-rule-create-smart">
                                        <span>
                                            <i class="fas fa-bolt"></i>Smart
                                        </span>
                                    </button>
                                </div>

                                <div class="form-row">
                                    <div class="col">
                                        <label for="rule-from">From</label>
                                    </div>
                                    <div class="col">
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button type="button" class="btn btn-info btn-sm" id="btn-rule-add-from" name="btn-rule-add-from">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                            <button type="button" class="btn btn-info btn-sm" id="btn-rule-delete-from" name="btn-rule-delete-from">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <select id="rule-from" size="6" class="form-control form-control-sm" multiple></select>
                                </div>
                                &nbsp;
                                <div class="form-row">
                                    <div class="col">
                                        <label for="rule-to">To</label>
                                    </div>
                                    <div class="col">
                                        <div class="btn-group btn-group-sm" role="group">
                                            <button type="button" class="btn btn-info btn-sm" id="btn-rule-add-to" name="btn-rule-add-to">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                            <button type="button" class="btn btn-info btn-sm" id="btn-rule-add-db-to" name="btn-rule-add-db-to">
                                                <i class="fas fa-database"></i>
                                            </button>
                                            <button type="button" class="btn btn-info btn-sm" id="btn-rule-delete-to" name="btn-rule-delete-to">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <input id="rule-to" class="form-control form-control-sm" type="text">
                                </div>
                                &nbsp;
                                <div class="form-group">
                                    <button type="button" class="btn btn-info btn-sm" id="btn-rule-create" name="btn-rule-create">
                                        <span>
                                            <i class="fas fa-gavel"></i>Create Rule
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="col-3">
                        <div class="form-group">
                            <label for="existing-rules-list">Normalization Rules</label>
                            <select id="existing-rules-list" class="form-control rule overflow-auto" size="20" multiple></select>
                            <button type="button" class="btn btn-info btn-sm" id="btn-rule-delete" name="btn-rule-delete" style="margin-top: 6px;">
                                <span>
                                    <i class="fas fa-trash-alt"></i>Delete Selected Rules
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="export-db-mapping" name="export-db-mapping">
                    <span>
                        <i class="fas fa-file-export"></i>
                        Export DB Mapping
                    </span>
                </button>
                <button type="button" class="btn btn-secondary" id="export-normalization" name="export-normalization">
                    <span>
                        <i class="fas fa-file-export"></i>
                        Export Normalization
                    </span>
                </button>
                <button type="button" class="btn btn-secondary" id="btn-re-process" name="btn-re-process">
                    <span>
                        <i class="fas fa-microchip"></i>
                        Re-Process
                    </span>
                </button>
                <button type="button" class="btn btn-secondary" id="close-modal" name="close-modal">
                    Close
                </button>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            columnNames: [],
            columnName: null,
            selectedDbTable: ''
        };
    },
    methods: {
        // filterDbRows(event) {
        //     const filterValue = $(`#${event.target.id}`).val();
        //     console.log('filterDbRows', event.target.id, filterValue);
        //     const colName = event.target.id.replace('db-col-filter-', '');
        //     console.log(colName);
        //     fillDbTableRows({
        //         colName,
        //         filterValue
        //     })
        // },
        // fillExistingRules() {
        //     ui.emptyOptions("existing-rules-list");

        //     const existingRules = normalization.getRulesForColumn(columnName);
        //     if (existingRules) {
        //         let cnt = 0;
        //         existingRules.forEach(el => {
        //             $('#existing-rules-list').append(`<option value="${cnt++}">[${el.from}] -> [${el.to}]</option>`);
        //         });
        //     }
        // },
        // fillDbTablesList(dbTableNames) {
        //     ui.emptyOptions('db-table-list');

        //     dbTableNames.forEach(tableName => {
        //         $('#db-table-list').append(`<option value="${tableName}">[${tableName}]</option>`);
        //     });
        // },
        // fillDbTableValuesList(rows) {
        //     if (rows.length > 0) {
        //         // head
        //         const filterTextBoxIds = [];
        //         let headHtml = '<tr>' + Object.keys(rows[0]).map(x => {
        //             const txtId = `db-col-filter-${x}`;
        //             filterTextBoxIds.push(txtId);
        //             return `<th>${x}<br><input id="${txtId}" type="text"></th>`;
        //         }).join('') + '</tr>';

        //         $('#db-table-rows thead').html(headHtml);

        //         filterTextBoxIds.forEach((id) => {
        //             $('#' + id).on('input', filterDbRows);
        //         });

        //         fillDbTableRows(null);
        //     }
        // },
        // fillDbTableRows(filter) {
        //     const rows = db.getRowsForTable(selectedDbTable);
        //     const idColName = rows[0].hasOwnProperty('USER_ID') ? 'USER_ID' : 'ID';
        //     let resultingRows = rows;

        //     if (filter && filter.filterValue.length > 2) {
        //         resultingRows = resultingRows.filter((x) => {
        //             const colValue = x[filter.colName].toLowerCase();
        //             if (isString(colValue)) {
        //                 if (colValue.indexOf(filter.filterValue.toLowerCase()) !== -1) {
        //                     return true;
        //                 }
        //             }
        //             return false;
        //         });
        //         resultingRows.sort(getComparatorFn(filter.colName));
        //     }

        //     let bodyHtml = '';
        //     resultingRows.forEach(row => {
        //         const arr = Object.values(row).map(x => `<td>${x}</td>`);
        //         bodyHtml += `<tr id="table-row-${row[idColName]}">` + arr.join('') + '</tr>';
        //     });
        //     $('#db-table-rows tbody').html(bodyHtml);
        // },
        // showTableFields() {
        //     const rows = db.getRowsForTable(selectedDbTable);
        //     if (rows && rows.length > 0) {
        //         const html = Object.keys(rows[0]).map(x => getCbHtml(x)).join('');
        //         $('#collapseVisibleFields').html(html);

        //         ui.emptyOptions('db-columns-list');

        //         Object.keys(rows[0]).forEach(el => {
        //             $('#db-columns-list').append(`<option value="${el}">[${el}]</option>`);
        //         });
        //     }

        // },
        // extractEmpId(str) {
        //     const startPos = str.indexOf('[');
        //     const endPos = str.indexOf(']')
        //     if (startPos !== -1 && endPos !== -1) {
        //         return str.substr(startPos + 1, endPos - startPos - 1).trim();
        //     }
        // },
        // handle(event) {
        //     let targetName = event.target.name;
        //     let tagName = event.target.tagName;

        //     if (tagName === 'TD') {
        //         const tr = event.target.closest('tr');
        //         if (tr) {
        //             console.log(tr.id);
        //             // const id = tr.id.replace('table-row-', '');

        //             $('#db-table-rows tbody tr').removeClass('bg-primary');
        //             $(`#${tr.id}`).addClass('bg-primary');
        //         }
        //         return;
        //     }

        //     if (!targetName) {
        //         const tagName = event.target.tagName;
        //         if (tagName === 'I' || tagName === 'SPAN') {
        //             const btn = event.target.closest('button');
        //             if (btn) {
        //                 targetName = btn.name;
        //             } else {
        //                 return;
        //             }
        //         }
        //     }

        //     switch (targetName) {

        //         case 'btn-rule-create-smart': {
        //             const text = $("#distinct-values-list option:selected").text();
        //             const optionValues = text.split('[').filter(i => i);

        //             const array = [];

        //             console.log(optionValues);
        //             for (let i = 0; i < optionValues.length; ++i) {
        //                 const arr = optionValues[i].split('] - ');
        //                 array.push({
        //                     key: arr[0],
        //                     occurence: parseInt(arr[1].replace('x', ''))
        //                 });
        //             }

        //             array.sort(compareOccurence).reverse();

        //             console.log(array);

        //             $('#rule-to').val(array[0].key);

        //             for (let i = 1; i < array.length; ++i) {
        //                 const el = array[i].key;
        //                 $('#rule-from').append(`<option value="${el}">${el}</option>`);
        //             }
        //         }
        //             break;

        //         case 'btn-rule-add-from': {
        //             const selections = $("#distinct-values-list").val();
        //             ui.fillSelectionValueAndText('rule-from', selections);
        //         }
        //             break;

        //         case 'btn-rule-delete-from': {
        //             const selections = $("#rule-from").val();
        //             console.log(selections);

        //             selections.forEach(x => {
        //                 $(`#rule-from option[value='${x}']`).remove();
        //             });
        //         }
        //             break;

        //         case 'btn-rule-add-to': {
        //             const selections = $("#distinct-values-list").val();
        //             $('#rule-to').val(selections[0]);
        //         }
        //             break;

        //         case 'btn-rule-add-db-to': {
        //             const selectedDbRow = $('#db-table-rows tbody tr.bg-primary');

        //             if (selectedDbRow && selectedDbRow.length > 0) {
        //                 const id = selectedDbRow[0].id.replace('table-row-', '');
        //                 const rows = db.getRowsForTable(selectedDbTable);

        //                 if (rows.length > 0) {
        //                     const idPropName = rows[0].hasOwnProperty('USER_ID') ? 'USER_ID' : 'ID';
        //                     const propName = $('#db-columns-list').val();
        //                     const dbRow = rows.find(x => x[idPropName] === id)
        //                     if (dbRow) {
        //                         $('#rule-to').val(dbRow[propName]);
        //                     }
        //                 }
        //             }
        //         }
        //             break;

        //         case 'btn-rule-delete-to':
        //             ui.emptyTextBox('rule-to');
        //             break;

        //         case 'btn-rule-create': {
        //             const fromValues = ui.getSelectedOptionListValues('rule-from');
        //             const toValue = $('#rule-to').val();
        //             normalization.create(columnName, fromValues, toValue);

        //             ui.emptyTextBox('rule-to');
        //             ui.emptyOptions('rule-from');

        //             fillExistingRules();
        //         }
        //             break;

        //         case 'btn-rule-delete': {
        //             const selectedIndices = $("#existing-rules-list").val();
        //             normalization.remove(columnName, selectedIndices);
        //             fillExistingRules();
        //         }
        //             break;

        //         case 'set-excel-to-db-table-mapping':
        //             mapping.createExcelColumnToDbTable(columnName, selectedDbTable);
        //             setModalTitle();
        //             break;

        //         case 'del-excel-to-db-table-mapping':
        //             mapping.deleteExcelColumnToDbTable(columnName);
        //             setModalTitle();
        //             fillDbTableValuesList();
        //             renderDistinctValues();
        //             break;

        //         case 'close-modal':
        //             columnName = null;
        //             $('#columnModal').modal('hide');
        //             break;

        //         case 'btn-re-process':
        //             applyRules().then(() => {
        //                 init();
        //             });
        //             break;

        //         case 'btn-mapping-add': {
        //             const arrExcel = $("#distinct-values-list").val();
        //             const selectedDbRow = $('#db-table-rows tbody tr.bg-primary');

        //             if (selectedDbRow && selectedDbRow.length > 0) {
        //                 const id = selectedDbRow[0].id.replace('table-row-', '');
        //                 const rows = db.getRowsForTable(selectedDbTable);

        //                 if (rows.length > 0) {
        //                     const idPropName = rows[0].hasOwnProperty('USER_ID') ? 'USER_ID' : 'ID';
        //                     const dbRow = rows.find(x => x[idPropName] === id)
        //                     if (dbRow) {
        //                         const excel = arrExcel[0];

        //                         mapping.createExcelValueToDbValue(columnName, excel, dbRow);
        //                         renderDistinctValues();

        //                         $('#db-table-rows tbody tr').removeClass('bg-primary');
        //                     }
        //                 }
        //             }
        //         }
        //             break;

        //         case 'btn-mapping-delete': {
        //             const arrExcel = $("#distinct-values-list").val();

        //             arrExcel.forEach(x => {
        //                 mapping.deleteMapping(columnName, x);
        //             });

        //             renderDistinctValues();
        //         }
        //             break;

        //         case 'btn-mapping-smart-empid':
        //             {
        //                 if (!selectedDbTable) {
        //                     alert('No DB Table Name Set')
        //                 }

        //                 const distinctValues = getDistinctValuesInColumn(columnName, columnNames, processedRows);

        //                 distinctValues.forEach(el => {
        //                     const excel = el.value;
        //                     const empId = extractEmpId(excel);
        //                     const dbRow = getDbRowFor(empId);

        //                     if (dbRow) {
        //                         mapping.createExcelValueToDbValue(columnName, excel, dbRow);
        //                     }
        //                 });

        //             }
        //             break;

        //         case 'btn-mapping-smart': {
        //             if (!selectedDbTable) {
        //                 alert('No DB Table Name Set')
        //             }
        //             const distinctValues = getDistinctValuesInColumn(columnName, columnNames, processedRows);
        //             distinctValues.forEach(el => {
        //                 const excel = el.value;
        //                 const dbRow = getDbRowFor(excel);

        //                 if (dbRow) {
        //                     mapping.createExcelValueToDbValue(columnName, excel, dbRow);
        //                 }
        //             });

        //             renderDistinctValues();
        //         }
        //             break;

        //         case 'export-db-mapping':
        //             exportDbMappingExcel();
        //             break;

        //         case 'export-normalization':
        //             exportNormalizationExcel();
        //             break;
        //     }
        // },
        // exportDbMappingExcel() {
        //     const data = [
        //         ['Excel Column Name', 'DB Table Name'],
        //         [columnName, selectedDbTable]
        //     ];
        //     data.push([]);
        //     data.push([]);

        //     const dbRows = db.getRowsForTable(selectedDbTable);

        //     const dbKeys = Object.keys(dbRows[0]);
        //     data.push(['EXCEL', ...dbKeys]);
        //     data.push([]);

        //     const vals = getDistinctValuesInColumn(columnName, columnNames, processedRows);
        //     vals.forEach(el => {
        //         let mappingObj = { ID: '(none)' };
        //         const mappingStr = mapping.lookupMapping(columnName, el.value);
        //         if (mappingStr !== '(none)') {
        //             mappingObj = JSON.parse(mappingStr);
        //         }

        //         const arr = Object.values(mappingObj)
        //         data.push([el.value, ...arr]);
        //     });

        //     excel.write(`db-mapping-${columnName}.xlsx`, 'mapping', data);
        // },
        // exportNormalizationExcel() {
        //     const data = [
        //         ['Excel Column Name', columnName]
        //     ];
        //     data.push([]);
        //     data.push([]);
        //     data.push(['EXCEL', 'NORMALIZED']);

        //     const processor = Processor(originalRows, {});

        //     processor.run().then(result => {
        //         const processedRows = result;
        //         const colValues = getDistinctValuesInColumn(columnName, columnNames, processedRows);

        //         colValues.forEach(el => {
        //             data.push([el.value, normalization.getNormalizedValueFor(columnName, el.value)]);
        //         });

        //         excel.write(`excel-normalization-${columnName}.xlsx`, 'normalization', data);
        //     });
        // },
        // getDbRowFor(excel) {
        //     const fieldName = $('#db-columns-list').val();
        //     console.log(fieldName);
        //     const dbTableRows = db.getRowsForTable(selectedDbTable);
        //     for (let i = 0; i < dbTableRows.length; ++i) {
        //         const row = dbTableRows[i];
        //         let filedValue = row[fieldName];
        //         if (filedValue) {
        //             if (filedValue.startsWith('"')) {
        //                 filedValue = removeFirstLastChar(filedValue);
        //             }
        //             if (filedValue === excel) {
        //                 return row;
        //             }
        //         }
        //     }
        //     return null;
        // },
        // renderDistinctValues() {
        //     ui.emptyOptions('distinct-values-list');

        //     const vals = getDistinctValuesInColumn(columnName, columnNames, processedRows);
        //     vals.forEach(el => {
        //         $('#distinct-values-list').append(`<option value="${el.value}">[${el.value}] - ${el.occurence}x - ${mapping.lookupMapping(columnName, el.value)}</option>`);
        //     });

        //     $('#label-distinct-values').text(`Distinct Values [${vals.length}]`);
        // },
        // setModalTitle() {
        //     $('#columnModalLabel').text(`Normalization Rules For Excel Column [${columnName}] - Mapping to DB Table ${selectedDbTable}`);
        // },
        // show(targetName) {
        //     columnNames = getColumnNames(originalRows);
        //     columnName = targetName.replace('btn-col-rule ', '');

        //     init();

        //     $('#columnModal').modal('show');
        // },
        // getCbHtml(colName) {
        //     const html = `
        //     <div class="form-check">
        //         <input class="form-check-input" type="checkbox" value="" id="${colName}">
        //         <label class="form-check-label" for="${colName}">
        //             ${colName}
        //         </label>
        //     </div>`;

        //     return html;
        // }
        show() {
            $('#columnModal').modal('show');
        },
        hide() {
            $('#columnModal').modal('hide');
        }
    },
    mounted() {
        console.log('column-rules mounted');

        // $('#db-table-list').change(() => {
        //     let val = '';
        //     $("#db-table-list option:selected").each(function () {
        //         val += $(this).text();
        //     });

        //     selectedDbTable = val;

        //     console.log(selectedDbTable);
        //     const dbTableRows = db.getRowsForTable(selectedDbTable);
        //     fillDbTableValuesList(dbTableRows);
        //     showTableFields();
        // });

        // selectedDbTable = mapping.getDbTableNameForExcelColumn(columnName);

        // setModalTitle();
        // renderDistinctValues();

        // ui.emptyTextBox('rule-to');
        // ui.emptyOptions('rule-from');

        // fillExistingRules();
        // fillDbTablesList(db.tables.map(x => x.name));
        // ui.emptyOptions('db-table-values-list');

        // $("#db-table-list").val(selectedDbTable).change();

        // showTableFields();


    }
});
