<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Prueba Técnica</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <button id="fetchData">Obtener Data</button>
    <div id="dataContainer"></div>

    <script>
        $(document).ready(function() {
            $('#fetchData').click(function() {
                $.ajax({
                    url: 'controller/DataController.php?action=getData',
                    method: 'GET',
                    success: function(data) {
                        var result = JSON.parse(data);
                        var table = '<table border="1"><tr><th>ID</th><th>Contact No</th><th>Last Name</th><th>Created Time</th></tr>';
                        $.each(result, function(index, value) {
                            table += '<tr><td>' + value.id + '</td><td>' + value.contact_no + '</td><td>' + value.lastname + '</td><td>' + value.createdtime + '</td></tr>';
                        });
                        table += '</table>';
                        $('#dataContainer').html(table);
                    }
                });
            });
        });
    </script>
</body>
</html>
