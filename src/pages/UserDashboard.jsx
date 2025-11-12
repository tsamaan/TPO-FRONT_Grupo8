import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);






    return (
        <div className="user-dashboard ">
            <div className="user-dashboard-header">
                <h1>Mi Perfil</h1>
                <button onClick={logout} className="logout-btn">Cerrar Sesion</button>
            </div>

            <div className="user-info-card">
                <h2>Informacion Personal</h2>
                <div className="user-info-grid">
                    <div className="user-info-item">
                        <span className="info-label">Nombre:</span>
                        <span className="info-value">{user?.name || `${user?.nombre} ${user?.apellido}`}</span>
                    </div>
                    <div className="user-info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{user?.email}</span>
                    </div>
                    {user?.phone && (
                        <div className="user-info-item">
                            <span className="info-label">Telefono:</span>
                            <span className="info-value">{user.phone}</span>
                        </div>
                    )}
                    {user?.address && (
                        <div className="user-info-item">
                            <span className="info-label">Direccion:</span>
                            <span className="info-value">{user.address}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
