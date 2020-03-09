'use strict';

const excel = (function () {

    function read(data) {
        const workbook = XLSX.read(
            data,
            {
                type: 'binary',
                cellDates: true
            }
        );
        const firstSheet = workbook.SheetNames[0];

        const rows = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[firstSheet],
            {
                header: 1,
                dateNF: 'dd/mm/yyyy',
                defval: ''
            }
        );
        return rows;
    }

    function write(fileName, sheetName, dataArray) {

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length); // convert s to arrayBuffer
            const view = new Uint8Array(buf);  // create uint8array as viewer
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF; // convert to octet
            }
            return buf;
        }

        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: 'TAG Excel Importer',
            Subject: 'none',
            Author: 'TCS',
            CreatedDate: new Date()
        };

        wb.SheetNames.push(sheetName);

        const ws = XLSX.utils.aoa_to_sheet(dataArray);
        wb.Sheets[sheetName] = ws;

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName);

    }

    return {
        read,
        write
    };

})();
