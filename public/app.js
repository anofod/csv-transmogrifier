
'use strict';

// NOTE: we should consider submitting this as a patch to papaparse
// Based on: http://stackoverflow.com/questions/31375531/how-to-use-promises-with-papaparse
Papa.parsePromise = function(file) {
    return new Promise(function(resolve, reject) {
        Papa.parse(file,
            {
                complete: resolve,
                error: reject,
            }
        );
    });
};

var data;
var fields;

$(document).ready(function () {
    $('#file-upload').on('change', function(e) {

        let file = this.files[0];

        $('#filename').text(file.name);

        Papa.parsePromise(file)
            .then(function(results) {

                let headerData = results.data.shift();

                // Set globals
                data = results.data;
                fields = headerData;

                let table = $( $('#table-template').html() );

                // Set column titles
                let row = $('<tr></tr>');
                headerData.forEach(function(result) {
                    $(row).append('<th contentEditable="true">' + result + '</th>');
                });
                $('thead', table).append(row);

                // Set row data
                results.data.forEach(function(rowData) {
                    let row = $('<tr></tr>');

                    rowData.forEach(function(rowItem) {
                        $(row).append('<td>' + rowItem + '</td>');
                    });

                    $('tbody', table).append(row);
                });

                // Display table and download link
                $('#csv-data').html(table);
                $('.download').show();

            });
    });

    // Download
    $('.download').on('click', function (e) {

        // Get new fields from table
        let newFields = [];
        $('th').each(function () {
            let field = $(this).text();
            newFields.push(field);
        });
        data.unshift(newFields);

        // Convert to CSV
        let csv = Papa.unparse(data);

        // Download as CSV
        window.open('data:text/csv,' + encodeURIComponent(csv));
    });
});
