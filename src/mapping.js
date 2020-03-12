'use strict';

const mapping = (function () {

    const kDbTableName = 'db-table-name';
    const kExcelToDb = 'excel-to-db';

    let data = {};

    function saveMappings() {
        localStorage.setItem('mappings', JSON.stringify(data));
    }

    function createExcelColumnToDbTable(excelColumnName, dbTableName) {
        console.log({ excelColumnName, dbTableName });

        const mappingObj = data[excelColumnName];
        if (mappingObj) {
            mappingObj[kDbTableName] = removeFirstLastChar(dbTableName);
        } else {
            data[excelColumnName] = { [kDbTableName]: removeFirstLastChar(dbTableName) }
        }
        saveMappings();
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
        saveMappings();
    }

    function lookupMapping(excelColumnName, excelValue) {
        const mappingObj = data[excelColumnName];
        if (mappingObj) {
            if (mappingObj.hasOwnProperty(kExcelToDb)) {
                const dbRow = mappingObj[kExcelToDb][excelValue];
                return dbRow ? JSON.stringify(dbRow) : '(none)';
            } else {
                return '(none)';
            }
        } else {
            return '(none)';
        }
    }

    function deleteMapping(excelColumnName, excelValue) {
        const mappingObj = data[excelColumnName];
        if (mappingObj) {
            delete mappingObj['excel-to-db'][excelValue];
        }
        saveMappings();
    }

    function load(receivedMappings) {
        let savedMappings = localStorage.getItem('mappings');
        if (savedMappings) {
            savedMappings = JSON.parse(savedMappings);
        }

        data = { ...receivedMappings, ...savedMappings }
        console.log('db-mapping->load', data);
    }

    function deleteExcelColumnToDbTable(columnName) {
        delete data[columnName];
        saveMappings();
    }

    function getAll() {
        return {...data};
    }
    return {
        createExcelColumnToDbTable,
        createExcelValueToDbValue,
        getDbTableNameForExcelColumn,
        lookupMapping,
        deleteMapping,
        load,
        deleteExcelColumnToDbTable,
        getAll
    };

})();
