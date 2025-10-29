
import { useState } from 'react';
import '../styles/ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar el formulario
        console.log('Datos del formulario:', formData);
        setFormData({
            nombre: '',
            email: '',
            telefono: '',
            mensaje: ''
        });
        alert('Mensaje enviado con éxito!');
    };

    return (
        <main className="contact-container">
            <section className="contact-info">
                <h1 className="contact-title">Contacto</h1>
                <ul className="contact-details">
                    <li><strong>WhatsApp:</strong> <a href="https://wa.me/541151783645" target="_blank" rel="noopener noreferrer">541151783645</a></li>
                    <li><strong>Email:</strong> <a href="mailto:haversack.ventas@gmail.com">haversack.ventas@gmail.com</a></li>
                    <li><strong>Dirección:</strong> Punta Arenas 1326, La Paternal, CABA</li>
                </ul>
            </section>
            <section className="contact-form-section">
                <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="ejemplo@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            placeholder="Ej: 11 1234-5678"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mensaje">Mensaje</label>
                        <textarea
                            id="mensaje"
                            name="mensaje"
                            value={formData.mensaje}
                            onChange={handleChange}
                            required
                            placeholder="Escribe tu mensaje aquí..."
                            rows={4}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Enviar
                    </button>
                </form>
            </section>
        </main>
    );
};

export default ContactPage;