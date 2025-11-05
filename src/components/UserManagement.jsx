import { useState, useEffect } from 'react';
import { getAllUsers, changeUserRole, deleteUser } from '../services/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditRole = (userId, currentRole) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole('');
  };

  const handleSaveRole = async (userId) => {
    try {
      await changeUserRole(userId, selectedRole);
      setSuccessMessage('Rol actualizado correctamente');
      setEditingUserId(null);
      setSelectedRole('');
      loadUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al cambiar el rol');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userName}?`)) {
      try {
        await deleteUser(userId);
        setSuccessMessage('Usuario eliminado correctamente');
        loadUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Error al eliminar el usuario');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'role-badge role-badge--superadmin';
      case 'ADMIN':
        return 'role-badge role-badge--admin';
      default:
        return 'role-badge role-badge--user';
    }
  };

  if (loading) {
    return <div className="user-management__feedback">Cargando usuarios...</div>;
  }

  if (error && !successMessage) {
    return <div className="user-management__feedback user-management__feedback--error">{error}</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management__header">
        <h2>Gestión de Usuarios</h2>
        <p className="user-management__subtitle">
          Como SUPERADMIN puedes cambiar el rol de cualquier usuario
        </p>
      </div>

      {successMessage && (
        <div className="user-management__success">{successMessage}</div>
      )}

      {error && (
        <div className="user-management__error">{error}</div>
      )}

      <div className="user-management__table-container">
        <table className="user-management__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Usuario</th>
              <th>Rol Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre} {user.apellido}</td>
                <td>{user.email}</td>
                <td>{user.usuario || '-'}</td>
                <td>
                  {editingUserId === user.id ? (
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="user-management__role-select"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPERADMIN">SUPERADMIN</option>
                    </select>
                  ) : (
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td>
                  <div className="user-management__actions">
                    {editingUserId === user.id ? (
                      <>
                        <button
                          onClick={() => handleSaveRole(user.id)}
                          className="btn btn--save"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn--cancel"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditRole(user.id, user.role)}
                          className="btn btn--edit"
                        >
                          Cambiar Rol
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.nombre)}
                          className="btn btn--delete"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="user-management__empty">
          No hay usuarios registrados
        </div>
      )}
    </div>
  );
};

export default UserManagement;
