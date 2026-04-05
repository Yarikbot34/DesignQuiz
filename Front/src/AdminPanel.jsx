import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

function ApplicationCard({ data, onDelete }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

    const formatPhone = (phone) => {
        const numbers = phone.replace(/\D/g, '')
        if (numbers.length !== 11) return phone
        return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9)}`
    }

    return (
        <div className="service-card admin-card">
            <div className="admin-card-header">
                <span className="admin-card-id">#{data.id}</span>
                <span className="admin-card-date">{formatDate(data.create_time)}</span>
            </div>

            <div className="admin-card-body">
                <div className="admin-field">
                    <span className="admin-field-label">Имя:</span>
                    <span className="admin-field-value">{data.name}</span>
                </div>

                <div className="admin-field">
                    <span className="admin-field-label">Телефон:</span>
                    <a href={`tel:${data.phone}`} className="admin-field-value admin-link-phone">
                        {formatPhone(data.phone)}
                    </a>
                </div>

                {data.email && (
                    <div className="admin-field">
                        <span className="admin-field-label">Email:</span>
                        <a href={`mailto:${data.email}`} className="admin-field-value">{data.email}</a>
                    </div>
                )}

                <div className="admin-field">
                    <span className="admin-field-label">Тип помещения:</span>
                    <span className="admin-field-value admin-badge">{data.room_type}</span>
                </div>

                <div className="admin-field">
                    <span className="admin-field-label">Зоны:</span>
                    <div className="admin-zones">
                        {data.zones?.map((zone, idx) => (
                            <span key={idx} className="admin-zone-tag">{zone}</span>
                        ))}
                    </div>
                </div>

                <div className="admin-field">
                    <span className="admin-field-label">Площадь:</span>
                    <span className="admin-field-value">{data.area} м²</span>
                </div>
                <div className="admin-field">
                    <span className="admin-field-label">Стиль:</span>
                    <span className="admin-field-value">{data.style}</span>
                </div>

                <div className="admin-field">
                    <span className="admin-field-label">Бюджет:</span>
                    <span className="admin-field-value admin-budget">{data.budget}</span>
                </div>

                {data.comment && (
                    <div className="admin-field">
                        <span className="admin-field-label">Комментарий:</span>
                        <p className="admin-comment">{data.comment}</p>
                    </div>
                )}

                {data.utm_source && (
                    <div className="admin-field">
                        <span className="admin-field-label">Источник:</span>
                        <span className="admin-field-value admin-utm">{data.utm_source}</span>
                    </div>
                )}
            </div>

            <div
                className="admin-card-actions"
                style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}
            >
                <button className="btn-nav primary" onClick={() => window.open(`tel:${data.phone}`, '_self')}>
                    Позвонить
                </button>
                <button className="btn-nav" onClick={() => navigator.clipboard.writeText(data.phone)}>
                    Копировать телефон
                </button>
                <button
                    className="btn-nav"
                    onClick={() => onDelete?.(data.id)}
                    style={{ borderColor: '#c00', color: '#c00' }}
                >
                    Удалить
                </button>
            </div>
        </div>
    )
}

export default function AdminPanel() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

        useEffect(() => {
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8000/quiz/orders', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setApplications(data.map((item, i) => ({ id: item.id || i + 1, ...item })));
        } catch (err) {
            console.error('Ошибка загрузки заказов:', err);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };
    fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        if (!window.confirm('Удалить эту заявку?')) return
        try {
            const res = await fetch(`http://localhost:8000/quiz/orders/${orderId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error(`Ошибка ${res.status}`)
            setApplications(prev => prev.filter(a => a.id !== orderId))
        } catch (err) {
            alert('Не удалось удалить: ' + err.message)
        }
    }

    return (
        <div className="page-wrapper">
            <Header />
            <main className="admin-main">
                <div className="admin-container">
                    <h1 className="admin-title" style={{ textAlign: 'left', marginBottom: '30px' }}>Заявки</h1>

                    {loading ? (
                        <div className="admin-loading">Загрузка...</div>
                    ) : applications.length === 0 ? (
                        <div className="admin-empty">Нет заявок</div>
                    ) : (
                        <div className="admin-grid">
                            {applications.map(app => (
                                <ApplicationCard key={app.id} data={app} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}