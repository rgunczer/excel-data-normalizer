'use strict';

Vue.component('pipeline-modal', {

    template: `
<div class="modal fade" id="pipelineModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="collectEmpIdModalLabel">Pipeline (Split Column into Two)</h5>
            </div>
            <div class="modal-body">
                <div class="container">
                    <form>
                        <div class="form-group row">
                            <label for="pipeline-excel-column-list" class="col-sm-3 col-form-label">Source Column</label>
                            <div class="col-sm-6">
                                <select id="pipeline-excel-column-list" class="form-control"></select>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-sm-3">

                            </div>
                            <div class="col-sm-6">
                                <div class="form-check">
                                    <input type="checkbox" id="hide-original-column" name="hide-original-column" class="form-check-input">
                                    <label for="hide-original-column" class="form-check-label">Hide Original Column</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Split Pattern (RegExp)</label>
                            <div class="col-sm-6">
                                <input id="pipeline-split-chars" type="text" value="[,/]+" class="form-control">
                            </div>
                            <div class="col-sm-3">
                                <button id="pipeline-split-column" name="pipeline-split-column" type="button" class="btn btn-info btn-sm">
                                    <span>
                                        <i class="fas fa-bomb"></i>Split
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div class="row justify-content-center">
                        <div class="overflow-auto" style="max-height: 400px;">
                            <table id="pipeline-results-table" class="table table-bordered table-hover table-sm">
                                <thead class="thead-light"></thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="pipeline-save" name="pipeline-save">
                    Save
                </button>
                <button type="button" class="btn btn-secondary" id="close-modal-pipeline" name="close-modal-pipeline">
                    Close
                </button>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            columnNameToEdit: '',
            sourceColumnValues: [],
            resultColumn: {
                names: ['original column name', 'column-a', 'column-b'],
                values: []
            }
        };
    },
    methods: {


    // $("#pipeline-excel-column-list").change(function () {
    //     columnNameToEdit = '';
    //     $("#pipeline-excel-column-list option:selected").each(function () {
    //         columnNameToEdit += $(this).text();
    //     });

    //     console.log('pipelineModal->change ', columnNameToEdit);

    //     resultColumn.names[0] = columnNameToEdit;

    //     const columnNames = getOriginalColumnNames(originalRows);
    //     sourceColumnValues = getDistinctValuesInColumn(columnNameToEdit, columnNames, originalRows)
    //         .map(x => x.value);

    //     resultColumn.values = [];

    //     sourceColumnValues.forEach(val => {
    //         resultColumn.values.push([val, '-', '-']);
    //     });

    //     renderTable();
    //     renderTableRows();
    // });

    save() {
        const obj = {};
        obj[columnNameToEdit] = {
            "split-regexp": $('#pipeline-split-chars').val(),
            "hide-original-column": $('#hide-original-column').prop('checked'),
            "new-column-names": [
                $('#pipe-col-name-' + resultColumn.names[1]).val(),
                $('#pipe-col-name-' + resultColumn.names[2]).val()
            ]
        }
        localStorage.setItem('pipeline', JSON.stringify(obj));
    },
    renderTable() {
        const filterTextBoxIds = [];
        const headHtml = '<tr>' + resultColumn.names.map(x => {
            const txtId = `pipe-col-name-${x}`;
            filterTextBoxIds.push(txtId);
            return `<th>${x}<br><input id="${txtId}" type="text"></th>`;
        }).join('') + '</tr>';

        $('#pipeline-results-table thead').html(headHtml);
    },
    renderTableRows() {
        let bodyHtml = '';
        resultColumn.values.forEach(row => {
            const arr = row.map(x => `<td>${x}</td>`);
            bodyHtml += `<tr>` + arr.join('') + '</tr>';
        });
        $('#pipeline-results-table tbody').html(bodyHtml);
    },
    init() {
        const columnNames = getOriginalColumnNames(originalRows);
        ui.emptyOptions('pipeline-excel-column-list');
        columnNames.forEach(name => {
            $('#pipeline-excel-column-list').append(`<option value="${name}">${name}</option>`);
        });
    },
    show() {
        init();
        $('#pipelineModal').modal('show');
    },
    hide() {
        $('#pipelineModal').modal('hide');
    },
    handle(event) {
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
                {
                    const splitRegExpStr = $('#pipeline-split-chars').val();

                    resultColumn.values = splitColumn(sourceColumnValues, splitRegExpStr);
                    renderTableRows();
                }
                break;

            case 'pipeline-save':
                save();
                break;
        }
    }
    }
});
