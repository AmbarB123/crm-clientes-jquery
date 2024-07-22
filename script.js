$(document).ready(function() {
    const apiUrl = 'http://localhost:3000/employees';
    localStorage.removeItem('employeeToEdit');
    
    const employeeList = [];

    function renderEmployees(employees) {
        const tbody = $('#employeeTable tbody');
        tbody.empty();
        employees.forEach((employee, index) => {
            const roleName = ["", "Desarrollador", "Team Leader", "CTO"][employee.roleId];
            tbody.append(`
                <tr>
                    <td><input type="checkbox" class="selectEmployee" data-index="${index}"></td>
                    <td>${employee.name}</td>
                    <td>${employee.surname}</td>
                    <td>${employee.dateOfBirth}</td>
                    <td>${employee.email}</td>
                    <td>${roleName}</td>
                    <td>
                        <button class="edit btn btn-info" data-index="${index}">Editar</button>
                        <button class="delete btn btn-warning" data-index="${index}">Eliminar</button>
                    </td>
                </tr>
            `);
        });
    }

    function fetchEmployees() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function(data) {
                employeeList.length = 0;
                employeeList.push(...data);
                renderEmployees(employeeList);
                updateDeleteButtonState();
            },
            error: function(xhr, status, error) {
                alert('Error al obtener la lista de empleados');
                console.error(error);
            }
        });
    }

    function deleteEmployee(index) {
        const employee = employeeList[index];
        $.ajax({
            url: `${apiUrl}/${employee.id}`,
            type: 'DELETE',
            success: function() {
                employeeList.splice(index, 1);
                renderEmployees(employeeList);
                updateDeleteButtonState();
            },
            error: function(xhr, status, error) {
                alert('Error al eliminar el empleado');
                console.error(error);
            }
        });
    }

    function deleteSelectedEmployees() {
        $('#modalConfirm').modal('show')
    }

    $('#confirmDelete').on('click', function(){
        confirmDelete()
        $('#modalConfirm').modal('hide')
    })

    function confirmDelete() {
        const selectedIndexes = $('.selectEmployee:checked').map(function() {
            return $(this).data('index');
        }).get();
        selectedIndexes.sort((a, b) => b - a);
        selectedIndexes.forEach(index => {
            deleteEmployee(index);
        });
    }

    function updateDeleteButtonState() {
        const selectedCount = $('.selectEmployee:checked').length;
        $('#deleteSelected').prop('disabled', selectedCount === 0);
    }

    $('#selectAll').click(function() {
        const isChecked = $(this).is(':checked');
        $('.selectEmployee').prop('checked', isChecked);
        updateDeleteButtonState();
    });

    $('#employeeTable').on('change', '.selectEmployee', function() {
        const allChecked = $('.selectEmployee').length === $('.selectEmployee:checked').length;
        $('#selectAll').prop('checked', allChecked);
        updateDeleteButtonState();
    });

    $('#deleteSelected').click(function() {
        deleteSelectedEmployees();
    });

    $('#employeeTable').on('click', '.edit', function() {
        const index = $(this).data('index');
        const employee = employeeList[index];
        localStorage.setItem('employeeToEdit', JSON.stringify(employee));
        window.location.href = 'views/createEmployee.html'; 
    });

    $('#employeeTable').on('click', '.delete', function() {
        const index = $(this).data('index');
        deleteEmployee(index);
    });

    $('#search').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredEmployees = employeeList.filter(employee => {
            return employee.name.toLowerCase().includes(searchTerm) ||
                   employee.surname.toLowerCase().includes(searchTerm) ||
                   employee.email.toLowerCase().includes(searchTerm);
        });

        renderEmployees(filteredEmployees);
    });

    fetchEmployees();
});
