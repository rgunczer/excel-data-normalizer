'use strict';

function Processor(excelRows, rules) {

    const processedRows = [];
    const tableBody = document.getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];

    function createStat() {
        for (let i = 0; i < columnNames.length; ++i) {
            const colVals = getColumnValues(i, processedRows);
            // console.log(colVals);

            const vals = getDistinctValuesInCol(colVals);
            // console.log(vals);

            const cellHeader = document.getElementById('cell-header-id ' + columnNames[i]);


            const colButtonsContainer = document.getElementById(`column-head-buttons-${columnNames[i]}`);
            if (colButtonsContainer) {
                colButtonsContainer.innerHTML = '';

                const button = document.createElement('button');
                button.className = 'btn btn-info';
                button.name = 'btn-col-rule ' + columnNames[i];
                const t = document.createTextNode(`${vals.length} / ${rules[columnNames[i]] ? rules[columnNames[i]].length : 0}`);
                button.appendChild(t);

                // const br = document.createElement("br");
                // cellHeader.appendChild(br);
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

            const colName = columnNames[i]
            const ruleArr = rules[colName];

            if (ruleArr) {
                for (let ii = 0; ii < ruleArr.length; ++ii) {
                    const rule = ruleArr[ii];
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
        localStorage.setItem('rules', JSON.stringify(rules));

        console.log('processor->run', {excelRows, rules});

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                for (let i = 1; i < excelRows.length; ++i) {
                    processRow(i, excelRows[i]);
                }

                createStat();

                resolve(processedRows);
            }, 100);
        });
    }

    return {
        run
    };

}
