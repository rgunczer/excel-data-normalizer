'use strict';

const columnRulesModal = (function () {

    let columnNames = [];
    let columnName = null;
    let selectedDbTable = '';

    function fillExistingRules() {
        ui.emptyOptions("existing-rules-list");

        const existingRules = normalization.getRulesForColumn(columnName);
        if (existingRules) {
            let cnt = 0;
            existingRules.forEach(el => {
                $('#existing-rules-list').append(`<option value="${cnt++}">[${el.from}] -> [${el.to}]</option>`);
            });
        }
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
                const selections = $("#distinct-values-list").val();
                ui.fillSelectionValueAndText('rule-from', selections);
            }
                break;

            case 'btn-rule-delete-from': {
                const selections = $("#rule-from").val();
                console.log(selections);

                selections.forEach(x => {
                    $(`#rule-from option[value='${x}']`).remove();
                });
            }
                break;

            case 'btn-rule-add-to': {
                const selections = $("#distinct-values-list").val();
                $('#rule-to').val(selections[0]);
            }
                break;

            case 'btn-rule-delete-to':
                ui.emptyTextBox('rule-to');
                break;

            case 'btn-rule-create': {
                const fromValues = ui.getSelectedOptionListValues('rule-from');
                const toValue = $('#rule-to').val();
                normalization.create(columnName, fromValues, toValue);

                ui.emptyTextBox('rule-to');
                ui.emptyOptions('rule-from');

                fillExistingRules();
            }
                break;

            case 'btn-rule-delete': {
                const selectedIndices = $("#existing-rules-list").val();
                normalization.remove(columnName, selectedIndices);
                fillExistingRules();
            }
                break;

            case 'set-excel-to-db-table-mapping':
                mapping.createExcelColumnToDbTable(columnName, selectedDbTable);
                setModalTitle();
                break;

            case 'del-excel-to-db-table-mapping':
                mapping.deleteExcelColumnToDbTable(columnName);
                setModalTitle();
                fillDbTableValuesList();
                renderDistinctValues();
                break;

            case 'close-modal':
                columnName = null;
                $('#columnModal').modal('hide');
                break;

            case 'btn-re-process':
                applyRules().then(() => {
                    init();
                });
                break;

            case 'btn-mapping-add': {
                const arrExcel = $("#distinct-values-list").val();
                const dbRowIndex = $("#db-table-values-list").val();

                const rows = db.getRowsForTable(selectedDbTable);

                const excel = arrExcel[0];
                const dbRow = rows[dbRowIndex];

                console.log({ excel, dbRow });

                mapping.createExcelValueToDbValue(columnName, excel, dbRow);


                renderDistinctValues();
            }
                break;

            case 'btn-mapping-delete': {
                const arrExcel = $("#distinct-values-list").val();

                arrExcel.forEach(x => {
                    mapping.deleteMapping(columnName, x);
                });

                renderDistinctValues();
            }
                break;

            case 'btn-mapping-smart': {
                if (!selectedDbTable) {
                    alert('No DB Table Name Set')
                }
                const distinctValues = getDistinctValuesInColumn(columnName, columnNames, processedRows);
                distinctValues.forEach(el => {
                    const excel = el.value;
                    const dbRow = getDbRowFor(excel);

                    if (dbRow) {
                        mapping.createExcelValueToDbValue(columnName, excel, dbRow);
                    }
                });

                renderDistinctValues();
            }
                break;

            case 'export-db-mapping':
                exportDbMappingExcel();
                break;

            case 'export-normalization':
                exportNormalizationExcel();
                break;
        }
    }

    function exportDbMappingExcel() {
        const data = [
            ['Excel Column Name', 'DB Table Name'],
            [columnName, selectedDbTable]
        ];
        data.push([]);
        data.push([]);

        const dbRows = db.getRowsForTable(selectedDbTable);

        const dbKeys = Object.keys(dbRows[0]);
        data.push(['EXCEL', ...dbKeys]);
        data.push([]);

        const vals = getDistinctValuesInColumn(columnName, columnNames, processedRows);
        vals.forEach(el => {
            let mappingObj = { ID: '(none)' };
            const mappingStr = mapping.lookupMapping(columnName, el.value);
            if (mappingStr !== '(none)') {
                mappingObj = JSON.parse(mappingStr);
            }

            const arr = Object.values(mappingObj)
            data.push([el.value, ...arr]);
        });

        excel.write(`db-mapping-${columnName}.xlsx`, 'mapping', data);
    }

    function exportNormalizationExcel() {
        const data = [
            ['Excel Column Name', columnName]
        ];
        data.push([]);
        data.push([]);
        data.push(['EXCEL', 'NORMALIZED']);

        const colValues = getDistinctValuesInColumn(columnName, columnNames, originalRows);

        colValues.forEach(el => {
            data.push([el.value, normalization.getNormalizedValueFor(columnName, el.value)]);
        });

        excel.write(`excel-normalization-${columnName}.xlsx`, 'normalization', data);
    }

    function getDbRowFor(excel) {
        const fieldName = $('#db-columns-list').val();
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

        const vals = getDistinctValuesInColumn(columnName, columnNames, processedRows);
        vals.forEach(el => {
            $('#distinct-values-list').append(`<option value="${el.value}">[${el.value}] - ${el.occurence}x - ${mapping.lookupMapping(columnName, el.value)}</option>`);
        });

        $('#label-distinct-values').text(`Distinct Values [${vals.length}]`);
    }

    function setModalTitle() {
        $('#columnModalLabel').text(`Normalization Rules For Excel Column [${columnName}] - Mapping to DB Table ${selectedDbTable}`);
    }

    function init() {
        selectedDbTable = mapping.getDbTableNameForExcelColumn(columnName);

        setModalTitle();
        renderDistinctValues();

        ui.emptyTextBox('rule-to');
        ui.emptyOptions('rule-from');

        fillExistingRules();
        fillDbTablesList(db.tables.map(x => x.name));
        ui.emptyOptions('db-table-values-list');

        $("#db-table-list").val(selectedDbTable).change();

        showTableFields();
    }

    function show(targetName) {
        columnNames = getColumnNames(originalRows);
        columnName = targetName.replace('btn-col-rule ', '');

        init();

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
