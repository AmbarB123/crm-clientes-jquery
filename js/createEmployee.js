$(document).ready(function() {
    const apiUrl = 'http://localhost:3000/employees';
    $('.titleEmployee').html('Crear empleado');
    $('.actionEmployee').html('Guardar');
    $('#alert').hide();

    function getEmployeeToEdit() {
        const employeeData = localStorage.getItem('employeeToEdit');
        if (employeeData) {
            $('.titleEmployee').html('Actualizar empleado');
            $('.actionEmployee').html('Editar');
            return JSON.parse(employeeData);
        }
        return null;
    }

    function fillFormWithEmployeeData(employee) {
        if (employee) {
            $('#name').val(employee.name);
            $('#surname').val(employee.surname);
            $('#dob').val(employee.dateOfBirth);
            $('#email').val(employee.email);
            $('#role').val(employee.roleId);
        }
    }

    const employeeToEdit = getEmployeeToEdit();
    fillFormWithEmployeeData(employeeToEdit);

    function validateAge(dateOfBirth) {
        let today = new Date();
        let dob = new Date(dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        let m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age >= 18 && age <= 65;
    }

    function messageAlert(hideClass, showClass, message) {
        $('#alert').removeClass(hideClass);
        $('#alert').addClass(showClass);
        $('#alert').html(message);
        $('#alert').fadeIn();
    }

    $('#employeeForm').on('submit', function(event) {
        event.preventDefault();
        const name = $('#name').val().trim();
        const surname = $('#surname').val().trim();
        const dateOfBirth = $('#dob').val();
        const email = $('#email').val().trim();
        const roleId = parseInt($('#role').val(), 10);

        if (!validateAge(dateOfBirth)) {
            messageAlert('alert-success', 'alert-danger', 'Por favor revisa la fecha de nacimiento se permiten mayores de 18 hasta los 65 años.');
            return;
        }

        if (roleId === 0) {
            messageAlert('alert-success', 'alert-danger', 'Por favor selecciona el rol para este empleado.');
            return;
        }

        $('#alert').hide();

        const employee = {
            name,
            surname,
            dateOfBirth,
            email,
            roleId
        };

        if (employeeToEdit) {
            $.ajax({
                url: `${apiUrl}/${employeeToEdit.id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(employee),
                success: function(response) {
                    messageAlert('alert-danger', 'alert-success', 'Empleado actualizado con éxito');
                    localStorage.removeItem('employeeToEdit');
                    setTimeout(() => {
                        window.location.href = ('../index.html');
                    }, 500);
                },
                error: function(xhr, status, error) {
                    messageAlert('alert-success', 'alert-danger', 'Error al actualizar el empleado');
                    console.error(error);
                }
            });
        } else {
            $.ajax({
                url: apiUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(employee),
                success: function(response) {
                    messageAlert('alert-danger', 'alert-success', 'Empleado guardado con éxito');
                    $('#employeeForm')[0].reset();
                    setTimeout(() => {
                        window.location.href = ('../index.html');
                    }, 500);
                },
                error: function(xhr, status, error) {
                    messageAlert('alert-success', 'alert-danger', 'Error al guardar el empleado');
                    console.error(error);
                }
            });
        }
    });
});
