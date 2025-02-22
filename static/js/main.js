document.addEventListener('DOMContentLoaded', function() {
    // Handle view buttons
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const assetDetails = {
                asset_id: row.querySelector('td:nth-child(1)').textContent,
                asset_name: row.querySelector('td:nth-child(2)').textContent,
                qr_code_number: row.querySelector('td:nth-child(3)').textContent,
                location: row.querySelector('td:nth-child(4)').textContent,
                installation_date: row.querySelector('td:nth-child(5)').textContent,
                status: row.querySelector('td:nth-child(6)').textContent
            };

            showViewModal(assetDetails);
        });
    });

    // Handle edit buttons
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', async function() {
            const assetId = this.dataset.id;
            const row = this.closest('tr');
            
            const currentValues = {
                asset_id: row.querySelector('td:nth-child(1)').textContent,
                asset_name: row.querySelector('td:nth-child(2)').textContent,
                qr_code_number: row.querySelector('td:nth-child(3)').textContent,
                location: row.querySelector('td:nth-child(4)').textContent,
                installation_date: row.querySelector('td:nth-child(5)').textContent,
                status: row.querySelector('td:nth-child(6)').textContent
            };

            showEditModal(assetId, currentValues);
        });
    });

    // Handle delete buttons
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', async function() {
            if (confirm('Are you sure you want to delete this asset?')) {
                const assetId = this.dataset.id;
                try {
                    const response = await fetch(`/assets/${assetId}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        alert('Error deleting asset');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error deleting asset');
                }
            }
        });
    });
});

function showViewModal(assetDetails) {
    const viewModalHTML = `
        <div class="modal-overlay">
            <div class="modal-container">
                <h3>Asset Details</h3>
                <div class="asset-details">
                    <p><strong>Asset ID:</strong> ${assetDetails.asset_id}</p>
                    <p><strong>Asset Name:</strong> ${assetDetails.asset_name}</p>
                    <p><strong>QR Code Number:</strong> ${assetDetails.qr_code_number}</p>
                    <p><strong>Location:</strong> ${assetDetails.location}</p>
                    <p><strong>Installation Date:</strong> ${assetDetails.installation_date}</p>
                    <p><strong>Status:</strong> ${assetDetails.status}</p>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', viewModalHTML);
}

function showEditModal(assetId, currentValues) {
    const editModalHTML = `
        <div class="modal-overlay">
            <div class="modal-container">
                <h3>Edit Asset</h3>
                <form id="editForm">
                    <div class="form-group">
                        <label for="edit_asset_id">Asset ID:</label>
                        <input type="text" id="edit_asset_id" value="${currentValues.asset_id}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_asset_name">Asset Name:</label>
                        <input type="text" id="edit_asset_name" value="${currentValues.asset_name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_qr_code">QR Code Number:</label>
                        <input type="text" id="edit_qr_code" value="${currentValues.qr_code_number}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_location">Location:</label>
                        <input type="text" id="edit_location" value="${currentValues.location}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_installation_date">Installation Date:</label>
                        <input type="date" id="edit_installation_date" value="${currentValues.installation_date}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_status">Status:</label>
                        <select id="edit_status" required>
                            <option value="active" ${currentValues.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="maintenance" ${currentValues.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                            <option value="retired" ${currentValues.status === 'retired' ? 'selected' : ''}>Retired</option>
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                        <button type="button" class="btn btn-cancel" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', editModalHTML);

    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            asset_id: document.getElementById('edit_asset_id').value,
            asset_name: document.getElementById('edit_asset_name').value,
            qr_code_number: document.getElementById('edit_qr_code').value,
            location: document.getElementById('edit_location').value,
            installation_date: document.getElementById('edit_installation_date').value,
            status: document.getElementById('edit_status').value
        };

        try {
            const response = await fetch(`/assets/${assetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error updating asset');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating asset');
        }
    });
} 