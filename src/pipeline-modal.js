'use strict';

const pipelineModal = (function () {

    let columnNameToEdit = '';
    let sourceColumnValues = [];
    const resultColumn = {
        names: ['original column name', 'column-a', 'column-b'],
        values: []
    };

    $("#pipeline-excel-column-list").change(function () {
        columnNameToEdit = '';
        $("#pipeline-excel-column-list option:selected").each(function () {
            columnNameToEdit += $(this).text();
        });

        console.log('pipelineModal->change ', columnNameToEdit);

        resultColumn.names[0] = columnNameToEdit;

        const columnNames = getColumnNames(originalRows);
        sourceColumnValues = getDistinctValuesInColumn(columnNameToEdit, columnNames, originalRows)
            .map(x => x.value);

        resultColumn.values = [];

        sourceColumnValues.forEach(val => {
            resultColumn.values.push([val, '-', '-']);
        });

        renderTable();
        renderTableRows();
    });

    function split() {
        resultColumn.values = [];

        const splitRegExpStr = $('#pipeline-split-chars').val();

        sourceColumnValues.forEach(val => {
            const arr = val.split(new RegExp(splitRegExpStr));
            arr[0] = arr[0].trim();
            if (arr.length > 1) {
                arr[1] = arr[1].trim();
            } else {
                arr[1] = '';
            }
            resultColumn.values.push([val, arr[0], arr[1]]);
        });

        renderTableRows();
    }

    function save() {
        const obj = {};
        obj[columnNameToEdit] = {
            "split-regexp": $('#pipeline-split-chars').val(),
            "new-column-names": [
                $('#pipe-col-name-' + resultColumn.names[1]).val(),
                $('#pipe-col-name-' + resultColumn.names[2]).val()
            ]
        }
        localStorage.setItem('pipeline', JSON.stringify(obj));
    }

    function renderTable() {
        const filterTextBoxIds = [];
        const headHtml = '<tr>' + resultColumn.names.map(x => {
            const txtId = `pipe-col-name-${x}`;
            filterTextBoxIds.push(txtId);
            return `<th>${x}<br><input id="${txtId}" type="text"></th>`;
        }).join('') + '</tr>';

        $('#pipeline-results-table thead').html(headHtml);
    }

    function renderTableRows() {
        let bodyHtml = '';
        resultColumn.values.forEach(row => {
            const arr = row.map(x => `<td>${x}</td>`);
            bodyHtml += `<tr>` + arr.join('') + '</tr>';
        });
        $('#pipeline-results-table tbody').html(bodyHtml);
    }

    function init() {
        const columnNames = getColumnNames(originalRows);
        ui.emptyOptions('pipeline-excel-column-list');
        columnNames.forEach(name => {
            $('#pipeline-excel-column-list').append(`<option value="${name}">${name}</option>`);
        });
    }

    function show() {
        init();
        $('#pipelineModal').modal('show');
    }

    function hide() {
        $('#pipelineModal').modal('hide');
    }

    function handle(event) {
        console.log('pipelineModal->handle ', event);
        let targetName = event.target.name;

        if (!targetName) {
            const tagName = event.target.tagName;
            if (tagName === 'I' || tagName === 'SPAN') {
                const btn = event.target.closest('button');
                if (btn) {
                    targetName = btn.name;
                } else {
                    return;
                }
            }
        }

        switch (targetName) {
            case 'close-modal-pipeline':
                hide();
                break;

            case 'pipeline-split-column':
                split();
                break;

            case 'pipeline-save':
                save();
                break;
        }
    }

    return {
        show,
        hide,
        handle
    };
})();
