'use strict';

function Processor(excelRows, rules) {

    const columnNames = getColumnNames(excelRows);
    const processedRows = [];
    const tableBody = document.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];

    function createColumnStatButtons() {
        for (let i = 0; i < columnNames.length; ++i) {
            const colName = columnNames[i];
            const vals = getDistinctValuesInColumn(colName, columnNames, processedRows);

            const colButtonsContainer = document.getElementById(`column-head-buttons-${colName}`);
            if (colButtonsContainer) {
                colButtonsContainer.innerHTML = '';

                const button = document.createElement('button');
                button.className = 'btn btn-info';
                button.name = 'btn-col-rule ' + colName;
                const rulesForCol = rules[colName];
                const t = document.createTextNode(`${vals.length} / ${rulesForCol ? rulesForCol.length : 0}`);
                button.appendChild(t);

                colButtonsContainer.appendChild(button);
            }
        }
    }

    function processRow(rowIndex, cells) {
        const arr = [];
        processedRows.push(arr);

        const row = tableBody.insertRow(-1);

        let cell = row.insertCell(-1);
        cell.innerHTML = `${rowIndex + 1}.`;

        for (let i = 0; i < cells.length; ++i) {
            cell = row.insertCell(-1);
            let cellValue = (cells[i] instanceof Date) ? formatDate(cells[i]) : cells[i];

            cellValue = (typeof cellValue === 'undefined') ? '' : cellValue;

            const colName = columnNames[i];
            const ruleArr = rules[colName];

            if (ruleArr) {
                for (let j = 0; j < ruleArr.length; ++j) {
                    const rule = ruleArr[j];
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

    function run() {
        console.log('processor->run', { excelRows, rules });

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                for (let i = 1; i < excelRows.length; ++i) {
                    processRow(i, excelRows[i]);
                }

                createColumnStatButtons();

                resolve(processedRows);
            }, 10);
        });
    }

    return {
        run
    };

}
