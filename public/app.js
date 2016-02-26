
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

$(document).ready(function () {
    $('#file-upload').on('change', function(e) {

        let file = this.files[0];

        $('#filename').text(file.name);

        Papa.parsePromise(file)
            .then(function(results) {

                let headerData = results.data.shift();

                // Set column titles
                headerData.forEach(function(result) {
                    $('#data-table thead tr').append('<th>' + result + '</th>');
                });

                // Set row data
                results.data.forEach(function(rowData) {

                    $('#data-table tbody').append('<tr>');

                    rowData.forEach(function(rowItem) {
                        $('#data-table tbody').append('<td>' + rowItem + '</td>');
                    });
                    
                    $('#data-table tbody').append('</tr>');
                });
            })
            ;
    });
});
