const ui = (function () {

    function showLoading() {
        $('#excel').html('<p class="loading"><i class="fas fa-spinner fa-spin"></i>Loading...</p>');
    }

    function emptyOptions(elementId) {
        document.getElementById(elementId).options.length = 0;
    }

    function setWorking(working) {
        const icon = document.getElementById('processing-rocket-icon');
        if (working) {
            icon.classList.add('fa-spin');
        } else {
            icon.classList.remove('fa-spin');
        }
    }

    function createTableAndHeaders(columns) {
        const tableEl = document.createElement('table');
        tableEl.className = "table table-bordered";

        // header
        tableHeadEl = tableEl.createTHead();
        tableHeadEl.className = 'thead-light';

        const row = tableHeadEl.insertRow(-1);
        let headerCell = document.createElement('th');
        headerCell.innerHTML = '1.';
        row.appendChild(headerCell);

        for (let i = 0; i < columns.length; ++i) {
            headerCell = document.createElement('th');
            headerCell.name = 'cell-header ' + columns[i];
            headerCell.id = 'cell-header-id ' + columns[i];
            headerCell.innerHTML = columns[i];
            row.appendChild(headerCell);
        }

        const tbdy = document.createElement('tbody');
        tableEl.appendChild(tbdy);

        const excelEl = document.getElementById("excel");
        excelEl.innerHTML = '';
        excelEl.appendChild(tableEl);
    }

    return {
        showLoading,
        emptyOptions,
        setWorking,
        createTableAndHeaders
    };

})();




