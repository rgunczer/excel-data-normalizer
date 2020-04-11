'use strict';

function Processor(columns, excelRows, rules) {

    const processedRows = [];

    function createColumnStatButtons() {

        for (let i = 0; i < columns.length; ++i) {
            const colName = columns[i].title;
            const vals = getDistinctValuesInColumn(colName, columns.map(x => x.title), processedRows);
            const rulesForCol = rules[colName];

            columns[i].buttonText = `${vals.length} / ${rulesForCol ? rulesForCol.length : 0}`;
        }
    }

    function processRow(rowIndex, cells) {
        const arr = [];
        processedRows.push(arr);

        // const row = tableBody.insertRow(-1);

        // let cell = row.insertCell(-1);
        // cell.innerHTML = `${rowIndex + 1}.`;

        for (let i = 0; i < cells.length; ++i) {
            // cell = row.insertCell(-1);
            let cellValue = (cells[i] instanceof Date) ? formatDate(cells[i]) : cells[i];

            cellValue = (typeof cellValue === 'undefined') ? '' : cellValue;

            const colName = columns[i].title;
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
            // cell.innerHTML = cellValue;
        }
    }

    function getColIndexToSplit(pipeline) {
        const originalColumnNames = getOriginalColumnNames(excelRows);
        for (let i = 0; i < originalColumnNames.length; ++i) {
            const colName = originalColumnNames[i];
            if (pipeline[colName]) {
                return {
                    config: pipeline[colName],
                    index: i
                };
            }
        }
        return null;
    }

    function getSplittedRow(row, pipeline) {
        const splittedRow = [];
        const splitInfo = getColIndexToSplit(pipeline);
        if (!splitInfo) {
            return row;
        }
        for (let i = 0; i < row.length; ++i) {
            const cellValue = row[i];
            if (i === splitInfo.index) {
                const { config } = splitInfo;
                const splittedValues = splitColumnValue(cellValue, config['split-regexp']);
                splittedValues.forEach(val => {
                    splittedRow.push(val);
                });
            } else {
                splittedRow.push(cellValue);
            }
        }
        return splittedRow;
    }

    function run() {
        console.log('processor->run', { excelRows, rules });

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                let pipelinedRows = excelRows;

                const pipeline = getPipeline();
                if (pipeline) {
                    pipelinedRows = [];
                    for (let i = 1; i < excelRows.length; ++i) {
                        const row = excelRows[i];
                        const splittedRow = getSplittedRow(row, pipeline);
                        pipelinedRows.push(splittedRow);
                    }
                }

                for (let i = 1; i < pipelinedRows.length; ++i) {
                    processRow(i, pipelinedRows[i]);
                }

                createColumnStatButtons();

                resolve(processedRows);
            }, 100);
        });
    }

    return {
        run
    };

}
