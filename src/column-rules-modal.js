'use strict';

const columnRulesModal = (function () {

    let columnNameToEdit = null;

    function fillExistingRulesListWith(rules) {
        ui.emptyOptions("existing-rules-list");

        let cnt = 0;
        rules.forEach(el => {
            $('#existing-rules-list').append(`<option value="${cnt++}">[${el.from}] -> [${el.to}]</option>`);
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


            case 'close-modal':
                columnNameToEdit = null;
                $('#columnModal').modal('hide');
                break;

            case 'close-modal-and-re-process':
                columnNameToEdit = null;
                $('#columnModal').modal('hide');
                applyRules();
                break;
        }
    }

    function show(targetName) {
        const cellName = targetName.replace('btn-col-rule ', '');

        columnNameToEdit = cellName;

        const colIndex = columnNames.indexOf(cellName);
        console.log(colIndex);

        $('#columnModalLabel').text(`Column: [${excelRows[0][colIndex]}]`);

        const colVals = getColumnValues(colIndex, processedRows);
        console.log(colVals);

        const vals = getDistinctValuesInCol(colVals);
        console.log(vals);

        ui.emptyOptions('distinct-values-list');

        vals.forEach(el => {
            $('#distinct-values-list').append(`<option value="${el.value}">[${el.value}] - ${el.occurence}x</option>`);
        });


        ui.emptyOptions('rule-from');

        $('#rule-to').val('');

        const existingRules = rules[cellName];

        ui.emptyOptions('existing-rules-list');

        if (existingRules) {
            fillExistingRulesListWith(existingRules);
        }

        $('#columnModal').modal('show');
    }

    return {
        handle,
        show
    }

})();
