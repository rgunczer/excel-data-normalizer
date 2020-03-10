'use strict';

const db = (function () {

    const tables = [];

    function parseCsv(text) {
        const rows = [];
        const lines = text.split('\n');
        const propNames = lines[0].split(',');

        for (let i = 1; i < lines.length; ++i) {
            const arr = lines[i].split(',');
            const obj = {};
            for (let j = 0; j < propNames.length; ++j) {
                obj[propNames[j]] = arr[j];
            }
            rows.push(obj);
        }

        return rows;
    }

    function getTableName(longName) {
        const searchFrags = [
            'prod-tag_',
            'prod-'
        ];
        let shortName = '';

        for (let i = 0; i < searchFrags.length; ++i) {
            const frag = searchFrags[i];
            let pos = longName.indexOf(frag);
            if (pos !== -1) {
                pos += frag.length;
                shortName = longName.substr(pos, longName.length - pos - 4);
                return shortName;
            }
        }

        return shortName;
    }

    function getTableObjFromName(tableName) {
        for (let i = 0; i < tables.length; ++i) {
            if (tables[i].name === tableName) {
                return tables[i];
            }
        }
    }

    function load(dbDesc) {
        console.log('db->load', dbDesc);

        const files = dbDesc.files.map(x => `data/csv/${x}`);

        api.loadText(files, (results) => {
            // console.log('received data', results);

            for (let i = 0; i < results.length; ++i) {
                const element = results[i];
                tables.push({
                    name: getTableName(files[i]),
                    rows: parseCsv(element)
                })

                // console.log(files[i]);
                // console.log(element);
            }
        });
    }

    function getRowsForTable(tableName) {
        const name = removeFirstLastChar(tableName);
        const tableObj = getTableObjFromName(name);
        if (tableObj) {
            return tableObj.rows;
        }
        return [];
    }

    return {
        getRowsForTable,
        load,
        tables
    };

})();
