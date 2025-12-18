// ===================================
// NEXO FRONTEND - FRIEND ITEM COMPONENT
// ===================================

const FriendItemComponent = {
    /**
     * Renderizar item de amigo
     * @param {Object} friend - Datos del amigo
     * @param {String} status - Estado de la amistad
     * @param {Boolean} requestedByMe - Si la solicitud fue enviada por mí
     * @param {Function} onChange - Callback cuando cambia el estado
     */
    render(friend, status, requestedByMe, onChange) {
        const u = friend.user || friend;
        const avatar = u.avatar_url
            ? CONFIG.API_BASE_URL + u.avatar_url
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nombre + ' ' + u.apellido)}&size=40&background=random`;

        const container = document.createElement('div');
        container.className = 'd-flex align-items-center justify-content-between border rounded p-3 mb-2 friend-item';
        container.dataset.userId = u.user_uuid;
        
        container.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <img src="${avatar}" width="50" height="50" class="rounded-circle" alt="${u.nombre}" />
                <div>
                    <div class="fw-semibold">${u.nombre} ${u.apellido}</div>
                    <div class="text-muted small">@${u.username}</div>
                </div>
            </div>
            
            <div class="d-flex gap-2 friend-actions">
                ${this.renderButtons(status, requestedByMe, u.user_uuid, onChange)}
            </div>
        `;
        
        return container;
    },

    /**
     * Renderizar botones según el estado
     */
    renderButtons(status, requestedByMe, userUuid, onChange) {
        if (status === 'pending') {
            if (requestedByMe) {
                return `<span class="text-muted small">Solicitud enviada</span>`;
            } else {
                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'd-flex gap-2';
                
                const acceptBtn = document.createElement('button');
                acceptBtn.className = 'btn btn-sm btn-success';
                acceptBtn.textContent = 'Aceptar';
                acceptBtn.onclick = async () => {
                    try {
                        await API.acceptFriend(userUuid);
                        if (onChange) onChange();
                    } catch (error) {
                        Utils.showAlert('No se pudo aceptar la solicitud', 'danger');
                    }
                };
                
                const rejectBtn = document.createElement('button');
                rejectBtn.className = 'btn btn-sm btn-danger';
                rejectBtn.textContent = 'Rechazar';
                rejectBtn.onclick = async () => {
                    try {
                        await API.rejectFriend(userUuid);
                        if (onChange) onChange();
                    } catch (error) {
                        Utils.showAlert('No se pudo rechazar la solicitud', 'danger');
                    }
                };
                
                buttonsDiv.appendChild(acceptBtn);
                buttonsDiv.appendChild(rejectBtn);
                return buttonsDiv.outerHTML;
            }
        }

        if (status === 'accepted') {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-sm btn-outline-danger';
            removeBtn.textContent = 'Eliminar';
            removeBtn.onclick = async () => {
                if (confirm('¿Estás seguro de eliminar este amigo?')) {
                    try {
                        await API.unfriend(userUuid);
                        if (onChange) onChange();
                    } catch (error) {
                        Utils.showAlert('No se pudo eliminar el amigo', 'danger');
                    }
                }
            };
            return removeBtn.outerHTML;
        }

        return `<span class="text-muted small">${status}</span>`;
    }
};

// Exportar componente
window.FriendItemComponent = FriendItemComponent;
