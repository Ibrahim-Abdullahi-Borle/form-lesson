document.addEventListener('DOMContentLoaded', function() {
            const apiUrl = "http://localhost:3000/users";
            const tableBody = document.querySelector("#userTable tbody");
            const editModal = document.getElementById("editModal");
            const editForm = document.getElementById("editForm");
            const cancelEditBtn = document.getElementById("cancelEdit");
            let currentEditingId = null;

            // Load users when page loads
            loadUsers();

            // Event delegation for buttons
            tableBody.addEventListener('click', function(e) {
                const row = e.target.closest('tr');
                if (!row) return;

                const id = row.cells[0].textContent;

                if (e.target.classList.contains('edit-btn')) {
                    openEditForm(id, row);
                } else if (e.target.classList.contains('delete-btn')) {
                    deleteUser(id);
                }
            });

            // Close modal when clicking cancel
            cancelEditBtn.addEventListener('click', closeEditForm);

            // Handle form submission
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveUserChanges();
            });

            // Close modal when clicking outside
            editModal.addEventListener('click', function(e) {
                if (e.target === editModal) {
                    closeEditForm();
                }
            });

            function loadUsers() {
                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => renderTable(data))
                    .catch(error => {
                        console.error('Error loading users:', error);
                        alert('Error loading user data. See console for details.');
                    });
            }

            function renderTable(users) {
                tableBody.innerHTML = '';
                
                if (!users || users.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="6" style="text-align: center;">No user data available</td>';
                    tableBody.appendChild(row);
                    return;
                }

                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name || ''}</td>
                        <td>${user.email || ''}</td>
                        <td>${user.phone || ''}</td>
                        <td>${user.message || ''}</td>
                        <td>
                            <button class="edit-btn" data-id="${user.id}">Edit</button>
                            <button class="delete-btn" data-id="${user.id}">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            function openEditForm(id, row) {
                currentEditingId = id;
                
                // Fill the form with current data
                document.getElementById('editId').value = id;
                document.getElementById('editName').value = row.cells[1].textContent;
                document.getElementById('editEmail').value = row.cells[2].textContent;
                document.getElementById('editPhone').value = row.cells[3].textContent;
                document.getElementById('editMessage').value = row.cells[4].textContent;
                
                // Show the modal
                editModal.style.display = 'flex';
            }

            function closeEditForm() {
                editModal.style.display = 'none';
                currentEditingId = null;
            }

            function saveUserChanges() {
                if (!currentEditingId) return;
                
                const updatedUser = {
                    name: document.getElementById('editName').value.trim(),
                    email: document.getElementById('editEmail').value.trim(),
                    phone: document.getElementById('editPhone').value.trim(),
                    message: document.getElementById('editMessage').value.trim()
                };

                fetch(`${apiUrl}/${currentEditingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedUser)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Update failed');
                    }
                    return response.json();
                })
                .then(() => {
                    alert('User updated successfully!');
                    closeEditForm();
                    loadUsers();
                })
                .catch(error => {
                    console.error('Update error:', error);
                    alert('Error updating user. See console for details.');
                });
            }

            function deleteUser(id) {
                if (!confirm('Are you sure you want to delete this user?')) {
                    return;
                }

                fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Delete failed');
                    }
                    loadUsers();
                })
                .catch(error => {
                    console.error('Delete error:', error);
                    alert('Error deleting user. See console for details.');
                });
         }
});