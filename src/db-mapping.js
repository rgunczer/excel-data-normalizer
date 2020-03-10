'use strict';

const dbMapping = (function () {

    const kDbTableName = 'db-table-name';
    const kExcelToDb = 'excel-to-db';


    let data = {
        "Channel": {
            "db-table-name": "channels",
            "excel-to-db": {
                "Buddy Program": {
                    "ID": "2",
                    "CHANNEL_NAME": "\"Buddy Scheme\""
                },
                "Job Fairs": {
                    "ID": "7",
                    "CHANNEL_NAME": "\"Job Fair\""
                },
                "Other referral": {
                    "ID": "9",
                    "CHANNEL_NAME": "\"Other referral\""
                },
                "GST": {
                    "ID": "8",
                    "CHANNEL_NAME": "\"Global Sourcing team\""
                },
                "Direct Sourcing": {
                    "ID": "4",
                    "CHANNEL_NAME": "\"Direct Sourcing\""
                },
                "Direct Application": {
                    "ID": "3",
                    "CHANNEL_NAME": "\"Direct Application\""
                },
                "ACE": {
                    "ID": "1",
                    "CHANNEL_NAME": "ACE"
                },
                "Absorption": {
                    "ID": "6",
                    "CHANNEL_NAME": "Absorption"
                },
                "Vendors": {
                    "ID": "5",
                    "CHANNEL_NAME": "Vendors"
                }
            }
        }
    };

    function createExcelColumnToDbTable(excelColumnName, dbTableName) {
        console.log({ excelColumnName, dbTableName });

        const mappingObj = data[excelColumnName];
        if (mappingObj) {
            mappingObj[kDbTableName] = removeFirstLastChar(dbTableName);
        } else {
            data[excelColumnName] = { [kDbTableName]: removeFirstLastChar(dbTableName) }
        }
    }

    function getDbTableNameForExcelColumn(excelColumnName) {
        return data[excelColumnName] ? data[excelColumnName][kDbTableName] : '';
    }

    function createExcelValueToDbValue(excelColumnName, excelValue, dbRow) {
        const mappingObj = data[excelColumnName];
        if (mappingObj) {
            if (!mappingObj[kExcelToDb]) {
                mappingObj[kExcelToDb] = {};
            }
            mappingObj[kExcelToDb][excelValue] = dbRow;
        }
    }

    function lookupMapping(excelColumnName, excelValue) {
        const mappingObj = data[excelColumnName];
        if (mappingObj) {
            const dbRow = mappingObj['excel-to-db'][excelValue];
            return dbRow ? JSON.stringify(dbRow) : '(none)';
        } else {
            return '(none)';
        }
    }

    function deleteMapping(excelColumnName, excelValue) {
        const mappingObj = data[excelColumnName];
        if (mappingObj) {
            delete mappingObj['excel-to-db'][excelValue];
        }
    }

    return {
        data,
        createExcelColumnToDbTable,
        createExcelValueToDbValue,
        getDbTableNameForExcelColumn,
        lookupMapping,
        deleteMapping
    };

})();
