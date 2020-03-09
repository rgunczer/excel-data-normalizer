'use strict';

let originalRows;
let processedRows;

let columnNames = [];

let rules = {};
let secret = {};

document.getElementById('browse-excel-file')
    .addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (reader.readAsBinaryString) {
            reader.onload = (e) => {
                ui.showLoading();
                originalRows = excel.read(e.target.result);
                columnNames = getColumnNames(originalRows);
                preProcessRawExcelData(originalRows);
                ui.createTableAndHeaders(columnNames);
            };
            reader.readAsBinaryString(file);
        }

        ui.displayFileInfo(`Name: [${file.name}], Size: [${file.size} bytes], last modified: [${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}]`)

        $('#browse-excel-file').val('');

    }, false);

function applyRules() {
    ui.setWorking(true);
    processor = Processor(originalRows, rules);

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
            case 'export-rules':
                const json = JSON.stringify(rules, null, 2);
                navigator.clipboard.writeText(json).then(() => {
                    alert('Rules Data is on Clipboard');
                });
                break;

            case 'process':
                applyRules();
                break;
        }
    }
});

api.load(arr => {
    rules = arr[0];
    secret = arr[1];
});
