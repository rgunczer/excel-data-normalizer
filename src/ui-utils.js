'use strict';

const ui = (function () {

    function displayFileInfo(info) {
        document.getElementsByClassName('navbar-text')[0].innerHTML = info;
    }

    function showLoading() {
        $('#excel').html('<p class="loading"><i class="fas fa-spinner fa-spin"></i>Loading...</p>');
    }

    function emptyOptions(elementId) {
        const el =document.getElementById(elementId);
        if (el) {
            el.options.length = 0;
        }
    }

    function setWorking(working) {
        const icon = document.getElementById('processing-icon');
        if (working) {
            icon.classList.add('fa-spin');
        } else {
            icon.classList.remove('fa-spin');
        }
    }

    function createTableAndHeaders(columns) {
        const tableEl = document.createElement('table');
        tableEl.className = "table table-bordered table-sm table-hover";

        // header
        const tableHeadEl = tableEl.createTHead();
        tableHeadEl.className = 'thead-light';

        const row = tableHeadEl.insertRow(-1);
        let headerCell = document.createElement('th');
        headerCell.innerHTML = '1.';
        headerCell.style.textAlign = 'left';
        row.appendChild(headerCell);

        columns.forEach(col => {
            headerCell = document.createElement('th');
            headerCell.name = 'cell-header ' + col;
            headerCell.id = 'cell-header-id ' + col;
            headerCell.innerHTML = `${col}<div id="column-head-buttons-${col}"></div>`;
            row.appendChild(headerCell);
        });

        const tbdy = document.createElement('tbody');
        tableEl.appendChild(tbdy);

        const excelEl = document.getElementById("excel");
        excelEl.innerHTML = '';
        excelEl.appendChild(tableEl);
    }

    function emptyTextBox(txtBoxId) {
        $(`#${txtBoxId}`).val('');
    }

    function getSelectedOptionListValues(selectId) {
        const values = [];
        $(`#${selectId} option`).each(function () {
            values.push($(this).val());
        });
        return values;
    }

    function fillSelectionValueAndText(selectId, stringArray) {
        stringArray.forEach(str => {
            $(`#${selectId}`).append(`<option value="${str}">${str}</option>`);
        })

    }

    return {
        displayFileInfo,
        showLoading,
        emptyOptions,
        emptyTextBox,
        setWorking,
        createTableAndHeaders,
        fillSelectionValueAndText,
        getSelectedOptionListValues
    };

})();




