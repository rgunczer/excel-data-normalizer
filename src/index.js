'use strict';

const app = new Vue({
    el: '#app',
    data: {
        fileInfo: '-',
        secret: {},
        originalRows: [],
        processedRows: [],
        excelFileName: '',
        sheetName: '',
        columns: [],
        showExcel: true,
        isLoading: false
    },
    methods: {
        readExcelFile(file) {
            const reader = new FileReader();
            if (reader.readAsBinaryString) {
                reader.onload = (e) => {
                    const obj = excel.read(e.target.result);
                    this.originalRows = obj.rows;
                    this.sheetName = obj.firstSheet;
                    this.columns = getColumnNames(this.originalRows);
                    preProcessRawExcelData(this.originalRows);
                };
                reader.readAsBinaryString(file);
            }

            this.excelFileName = file.name;

            this.fileInfo = [
                `Name: [${file.name}]`,
                `Size: [${file.size} bytes]`,
                `last modified: [${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}]`
            ].join('');
        },
        showColumnRules(index) {
            console.log('showColumnRules ' + index);
            this.$refs.columnRulesModalComponent.show();
        },
        exportRules() {
            const json = JSON.stringify(normalization.getAll(), null, 2);
            navigator.clipboard.writeText(json).then(() => {
                alert('Rules Data is on Clipboard');
            });
        },
        exportMappings() {
            const json = JSON.stringify(mapping.getAll(), null, 2);
            navigator.clipboard.writeText(json).then(() => {
                alert('Mapping Data is on Clipboard');
            });
        },
        saveExcelFile() {
            const defaultFileName = excelFileName.replace('.xlsx', `-modified.xlsx`);
            const fileName = prompt('Enter file name', defaultFileName);

            if (fileName !== null) {
                const sheetName1 = sheetName;
                const tempArr = processedRows;
                // const data = tempArr.map(x => [x.empid, x.name]);

                excel.write(fileName, sheetName1, tempArr);
                // console.log({fileName, sheetName1, tempArr});
            }
        },
        process() {
            return new Promise((resolve, reject) => {

                this.showExcel = false;
                this.isLoading = true;
                const processor = Processor(this.columns, this.originalRows, normalization.getAll());

                processor.run().then(result => {
                    this.processedRows = result;
                    this.isLoading = false;
                    this.showExcel = true;
                    resolve('ok');
                });

            });
        },
        pipeline() {
            pipelineModal.show();
        }
    },
    mounted() {
        const files = [
            'secret.json',
            'rules.json',
            'mappings.json',
            'db.json'
        ];

        api.loadJson(
            files.map(x => `data/${x}`),
            arr => {
                this.secret = arr[0];
                normalization.load(arr[1]);
                mapping.load(arr[2]);
                db.load(arr[3]);
            }
        );
    }
});
