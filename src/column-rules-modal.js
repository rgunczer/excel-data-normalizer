'use strict';

const columnRulesModal = (function () {

    let columnNameToEdit = null;
    let selectedDbTable = '';

    function fillExistingRulesListWith(rules) {
        ui.emptyOptions("existing-rules-list");

        let cnt = 0;
        rules.forEach(el => {
            $('#existing-rules-list').append(`<option value="${cnt++}">[${el.from}] -> [${el.to}]</option>`);
        });
    }

    function fillDbTablesList(dbTableNames) {
        ui.emptyOptions('db-table-list');

        dbTableNames.forEach(tableName => {
            $('#db-table-list').append(`<option value="${tableName}">[${tableName}]</option>`);
        });
    }

    function fillDbTableValuesList(values) {
        ui.emptyOptions('db-table-values-list');

        let index = 0;
        values.forEach(val => {
            // const v = val.replace(/,/g, ' - ');
            $('#db-table-values-list').append(`<option value="${index++}">[${JSON.stringify(val)}]</option>`);
        });
    }

    function handle(targetName) {

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
                ui.emptyOptions("rule-from");

                fillExistingRulesListWith(rules[columnNameToEdit]);

                console.log(rules[columnNameToEdit]);
            }
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

            case 'set-excel-to-db-table-mapping':
                dbMapping.createExcelColumnToDbTable(columnNameToEdit, selectedDbTable);
                break;


            case 'close-modal':
                columnNameToEdit = null;
                $('#columnModal').modal('hide');
                break;

            case 'close-modal-and-re-process':
                columnNameToEdit = null;
                $('#columnModal').modal('hide');
                applyRules();
                break;

            case 'btn-mapping-add': {
                const arrExcel = $("#distinct-values-list").val();
                const dbRowIndex = $("#db-table-values-list").val();

                const rows = db.getRowsForTable(selectedDbTable);

                const excel = arrExcel[0];
                const dbRow = rows[dbRowIndex];

                console.log({ excel, dbRow });

                dbMapping.createExcelValueToDbValue(columnNameToEdit, excel, dbRow);


                renderDistinctValues();
            }
                break;

            case 'btn-mapping-delete': {
                const arrExcel = $("#distinct-values-list").val();

                arrExcel.forEach(x => {
                    dbMapping.deleteMapping(columnNameToEdit, x);
                });

                renderDistinctValues();
            }
                break;

            case 'btn-mapping-smart': {

                const colIndex = columnNames.indexOf(columnNameToEdit);
                const colVals = getColumnValues(colIndex, processedRows);
                const vals = getDistinctValuesInCol(colVals);

                vals.forEach(el => {
                    const excel = el.value;
                    const dbRow = getDbRowFor(excel);

                    if (dbRow) {
                        dbMapping.createExcelValueToDbValue(columnNameToEdit, excel, dbRow);
                    }
                });

                renderDistinctValues();
            }
                break;
        }
    }

    function getDbRowFor(excel) {
        const fieldName =  $('#db-columns-list').val(); // 'CHANNEL_NAME';
        console.log(fieldName);
        const dbTableRows = db.getRowsForTable(selectedDbTable);
        for (let i = 0; i < dbTableRows.length; ++i) {
            const row = dbTableRows[i];
            let filedValue = row[fieldName];
            if (filedValue) {
                if (filedValue.startsWith('"')) {
                    filedValue = removeFirstLastChar(filedValue);
                }
                if (filedValue === excel) {
                    return row;
                }
            }
        }
        return null;
    }

    function renderDistinctValues() {
        ui.emptyOptions('distinct-values-list');

        const colIndex = columnNames.indexOf(columnNameToEdit);
        const colVals = getColumnValues(colIndex, processedRows);
        const vals = getDistinctValuesInCol(colVals);

        vals.forEach(el => {
            $('#distinct-values-list').append(`<option value="${el.value}">[${el.value}] - ${el.occurence}x - ${dbMapping.lookupMapping(columnNameToEdit, el.value)}</option>`);
        });
    }

    function show(targetName) {
        columnNameToEdit = targetName.replace('btn-col-rule ', '');

        $('#columnModalLabel').text(`Rules For Column: [${columnNameToEdit}]`);

        renderDistinctValues();

        ui.emptyOptions('rule-from');

        $('#rule-to').val('');

        const existingRules = rules[columnNameToEdit];

        ui.emptyOptions('existing-rules-list');

        if (existingRules) {
            fillExistingRulesListWith(existingRules);
        }

        fillDbTablesList(db.tables.map(x => x.name));
        ui.emptyOptions('db-table-values-list');

        selectedDbTable = dbMapping.getDbTableNameForExcelColumn(columnNameToEdit);
        $("#db-table-list").val(selectedDbTable).change();

        showTableFields();

        $('#columnModal').modal('show');
    }

    function showTableFields() {
        const rows = db.getRowsForTable(selectedDbTable);
        if (rows && rows.length > 0) {
            const html = Object.keys(rows[0]).map(x => getCbHtml(x)).join('');
            $('#collapseVisibleFields').html(html);

            ui.emptyOptions('db-columns-list');

            Object.keys(rows[0]).forEach(el => {
                $('#db-columns-list').append(`<option value="${el}">[${el}]</option>`);
            });
        }

    }

    function getCbHtml(colName) {
        const html = `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="${colName}">
            <label class="form-check-label" for="${colName}">
                ${colName}
            </label>
        </div>`;

        return html;
    }

    $('#db-table-list').change(() => {
        let val = '';
        $("#db-table-list option:selected").each(function () {
            val += $(this).text();
        });

        selectedDbTable = val;

        console.log(selectedDbTable);
        const dbTableRows = db.getRowsForTable(selectedDbTable);
        fillDbTableValuesList(dbTableRows);
        showTableFields();
    });

    return {
        handle,
        show
    }

})();
