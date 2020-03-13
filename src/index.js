'use strict';

let originalRows;
let processedRows;

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
                const columnNames = getColumnNames(originalRows);
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

    return new Promise((resolve, reject) => {

        ui.setWorking(true);
        const processor = Processor(originalRows, normalization.getAll());

        processor.run().then(result => {
            processedRows = result;
            ui.setWorking(false);

            resolve('ok');
        });

    });

}

document.addEventListener('click', event => {
    let targetName = event.target.name;
    let tagName = event.target.tagName;

    console.log('tag: ', tagName);

    if ($('body').hasClass('modal-open')) {

        if ($('#columnModal').hasClass('show')) {
            columnRulesModal.handle(event);
            return;
        }

    }

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

    console.log('click: ', targetName);

    if (targetName) {
        if (targetName.startsWith('btn-col-rule')) {
            columnRulesModal.show(targetName);
            return;
        }

        employeeIdHarvesterModal.handle(targetName);

        switch (targetName) {
            case 'btn-export-rules': {
                const json = JSON.stringify(normalization.getAll(), null, 2);
                navigator.clipboard.writeText(json).then(() => {
                    alert('Rules Data is on Clipboard');
                });
            }
                break;

            case 'btn-export-mappings': {
                const json = JSON.stringify(mapping.getAll(), null, 2);
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
        'secret.json',
        'rules.json',
        'mappings.json',
        'db.json'
    ];

    api.loadJson(
        files.map(x => `data/${x}`),
        arr => {
            secret = arr[0];
            normalization.load(arr[1]);
            mapping.load(arr[2]);
            db.load(arr[3]);
        });

})();
