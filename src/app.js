'use strict';

let originalRows;
let processedRows;

let columnNames = [];

let rules = {};
let secret = {};

let excelFileName = '';
let sheetName = '';

document.getElementById('browse-excel-file')
    .addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (reader.readAsBinaryString) {
            reader.onload = (e) => {
                ui.showLoading();
                const obj = excel.read(e.target.result);
                originalRows = obj.rows;
                sheetName = obj.firstSheet;
                columnNames = getColumnNames(originalRows);
                preProcessRawExcelData(originalRows);
                ui.createTableAndHeaders(columnNames);
            };
            reader.readAsBinaryString(file);
        }

        excelFileName = file.name;

        ui.displayFileInfo(`Name: [${file.name}], Size: [${file.size} bytes], last modified: [${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}]`)

        $('#browse-excel-file').val('');

    }, false);

function applyRules() {
    ui.setWorking(true);
    const processor = Processor(originalRows, rules);

    processor.run().then(result => {
        processedRows = result;
        ui.setWorking(false);
    });
}

document.addEventListener('click', event => {
    const targetName = event.target.name;
    console.log('click: ', targetName);

    if (targetName) {
        if (targetName.startsWith('btn-col-rule')) {
            columnRulesModal.show(targetName);
            return;
        }

        columnRulesModal.handle(targetName);
        employeeIdHarvesterModal.handle(targetName);

        switch (targetName) {
            case 'btn-export-rules': {
                const json = JSON.stringify(rules, null, 2);
                navigator.clipboard.writeText(json).then(() => {
                    alert('Rules Data is on Clipboard');
                });
            }
                break;

            case 'btn-export-mappings': {
                const json = JSON.stringify(dbMapping, null, 2);
                navigator.clipboard.writeText(json).then(() => {
                    alert('Mapping Data is on Clipboard');
                });
            }
                break;

            case 'btn-save-excel-file': {
                const defaultFileName = excelFileName.replace('.xlsx', `-modified.xlsx`);
                const fileName = prompt('Enter file name', defaultFileName);

                if (fileName !== null) {
                    const sheetName1 = sheetName;
                    const tempArr = processedRows;
                    // const data = tempArr.map(x => [x.empid, x.name]);

                    excel.write(fileName, sheetName1, tempArr);
                    // console.log({fileName, sheetName1, tempArr});
                }
            }
                break;

            case 'process':
                applyRules();
                break;
        }
    }
});

(function () {

    const files = [
        'rules.json',
        'secret.json',
        'db.json'
    ];

    api.loadJson(
        files.map(x => `data/${x}`),
        arr => {
            rules = arr[0];
            secret = arr[1];

            const savedRules = localStorage.getItem('rules');
            console.log('saved rules: ', savedRules);
            if (savedRules) {
                rules = JSON.parse(savedRules);
            }

            db.load(arr[2]);
        });

})();
