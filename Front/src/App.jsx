import { useState, useEffect, useRef } from 'react'
import './App.css'


const OPTIONS_BY_TYPE = {
    "Квартира": ["Кухня", "Гостиная", "Спальня", "Детская", "Санузел", "Прихожая", "Кабинет", "Гардеробная", "Балкон / лоджия", "Полностью всё помещение"],
    "Частный дом": ["Кухня", "Гостиная", "Спальня", "Детская", "Санузел", "Прихожая", "Кабинет", "Гардеробная", "Балкон / лоджия", "Полностью всё помещение"],
    "Офис": ["Кухня", "Санузел", "Прихожая", "Кабинет", "Гардеробная", "Полностью всё помещение"],
    "Коммерческое помещение": ["Кухня", "Санузел", "Кабинет", "Гардеробная", "Полностью всё помещение"],
    "Студия / апартаменты": ["Кухня", "Гостиная", "Спальня", "Детская", "Санузел", "Прихожая", "Кабинет", "Гардеробная", "Балкон / лоджия", "Полностью всё помещение"],
    "Другое": ["Кухня", "Гостиная", "Спальня", "Детская", "Санузел", "Прихожая", "Кабинет", "Гардеробная", "Балкон / лоджия", "Полностью всё помещение"]
}


const QUIZ_DATA = [
    {
        id: 1,
        type: 'single',
        title: 'Какое помещение вы планируете оформить?',
        options: ['Квартира', 'Частный дом', 'Офис', 'Коммерческое помещение', 'Студия / апартаменты', 'Другое'],
        message: 'Знание типа помещения поможет нам определить базовый объем работ и стоимость проекта.'
    },
    {
        id: 2,
        type: 'multiple',
        title: 'Какие зоны нужно включить в дизайн-проект?',
        options: [], // Опции будут подставляться динамически
        message: 'Перечислите основные комнаты. Мы можем спроектировать как одну комнату, так и весь дом под ключ.'
    },
    {
        id: 3,
        type: 'range',
        title: 'Укажите примерную площадь помещения',
        min: 20,
        max: 300,
        step: 5,
        defaultValue: 60,
        message: 'Площадь напрямую влияет на стоимость разработки дизайн-проекта (цена за м²).'
    },
    {
        id: 4,
        type: 'single',
        title: 'Какой стиль интерьера вам ближе?',
        options: ['Современный', 'Минимализм', 'Скандинавский', 'Лофт', 'Неоклассика', 'Классика', 'Пока не определился'],
        message: 'Это поможет нашим дизайнерам подготовить для вас наиболее релевантные примеры.'
    },
    {
        id: 5,
        type: 'single',
        title: 'Какой бюджет на реализацию интерьера вы рассматриваете?',
        options: ['До 500 000 ₽', '500 000 – 1 000 000 ₽', '1 000 000 – 2 000 000 ₽', 'От 2 000 000 ₽', 'Пока не знаю'],
        message: 'Бюджет на реализацию важен, чтобы мы предложили материалы и решения, соответствующие вашим возможностям.'
    }
]


const TYPE_IMAGES = {
    "Квартира": "https://avatars.mds.yandex.net/i?id=146e938aa58c2681fe08ad7eb6dd12f8_l-12141618-images-thumbs&n=13",
    "Частный дом": "https://i.pinimg.com/originals/ce/f0/67/cef067da95b8ed104d14e078b5de2081.jpg?nii=t",
    "Офис": "https://avatars.mds.yandex.net/i?id=2da2fe12d866d8604947a39faef36237_l-5192450-images-thumbs&n=13",
    "Коммерческое помещение": "https://i.pinimg.com/originals/d7/b8/92/d7b8928390b6dd7ae879092b420a0ed0.jpg",
    "Студия / апартаменты": "https://qlean.ru/blog/wp-content/uploads/2021/08/toa-heftiba-FV3GConVSss-unsplash-800x400.jpg",
    "Другое": "https://gutenix.com/demo/free/elementor/2166/wp-content/uploads/2019/02/imageGal4.png"
}


const ZONE_IMAGES = {
    "Кухня": "https://i.ytimg.com/vi/MkwdaqEuaAI/maxresdefault.jpg",
    "Гостиная": "https://avatars.mds.yandex.net/i?id=f97494950d482152601002205d43596f_l-4912286-images-thumbs&n=13",
    "Спальня": "https://i.pinimg.com/originals/e5/d5/4a/e5d54afbd5f91a27ca26bc5583903bbc.jpg?nii=t",
    "Детская": "https://i.pinimg.com/originals/51/76/34/5176344d468a578e25838d4af4db3e95.png",
    "Санузел": "https://i.pinimg.com/736x/0a/6c/0e/0a6c0ea9b38a61a27cc8e06c31dfae53.jpg",
    "Прихожая": "https://avatars.mds.yandex.net/get-mpic/5086514/2a000001955ca8793246140ef69cc98c2c4e/orig",
    "Кабинет": "https://i.pinimg.com/originals/cd/9e/53/cd9e53f3449711e06dbaca960a658ce9.jpg",
    "Гардеробная": "https://i.pinimg.com/originals/7c/20/8e/7c208ed320460cc965db891db9b6b0ad.jpg?nii=t",
    "Балкон / лоджия": "https://i.pinimg.com/originals/93/94/63/939463391a1a518037200d07c271ee11.png?nii=t",
    "Полностью всё помещение": "https://www.su-re.nl/app/uploads/2021/08/banner-img-1920x1080.jpg"
}


const STYLE_IMAGES = {
    "Современный": "https://i.pinimg.com/originals/83/4a/d0/834ad0015864fc1b5e25c7561d1bba8b.png?nii=t",
    "Минимализм": "https://avatars.mds.yandex.net/i?id=973143bbea0ad847443bb32c39a2d453_l-4234799-images-thumbs&n=13",
    "Скандинавский": "https://images.stroistyle.com/posts/23588673-stil-skandi-v-interere-kvartiry-53.jpg",
    "Лофт": "https://i.pinimg.com/originals/91/49/48/9149484304d9aed151f16182c994a420.png?nii=t",
    "Неоклассика": "https://www.archrevue.ru/images/tb/4/2/2/42213/17695463659018_w1500h1500.jpg",
    "Классика": "https://avatars.mds.yandex.net/get-turbo/3070322/2a0000017ca390a1ce03938aed6e9b99e3ec/lc_desktop_1920px_r16x9_pd20",
    "Пока не определился": "https://gutenix.com/demo/free/elementor/2166/wp-content/uploads/2019/02/imageGal4.png"
}



function Header() {
    const handleLogoClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
    return (
        <header className="site-header">
            <div className="header-container">
                <div className="header-top">
                    <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                        <span className="logo-icon">✦</span>
                        VERNIKODOV
                    </div>
                    <div className="header-contact">
                        <a href="tel:+79999999999" className="phone-link">+7 (999) 999-99-99</a>
                        <span className="work-hours">9:00–20:00</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

function ServicesSection() {
    const services = [
        { title: 'Дизайн-проект квартиры', description: 'Полный комплекс услуг по разработке дизайна интерьера квартиры любой сложности' },
        { title: 'Дизайн-проект дома', description: 'Создание уютного и функционального пространства для вашего загородного дома' },
        { title: 'Дизайн коммерческих помещений', description: 'Разработка интерьеров для офисов, магазинов, ресторанов и других объектов' },
        { title: '3D-визуализация', description: 'Фотореалистичная визуализация будущего интерьера для наглядного представления' },
        { title: 'Авторский надзор', description: 'Контроль за реализацией дизайн-проекта на всех этапах ремонтных работ' },
        { title: 'Комплектация объекта', description: 'Подбор и закупка отделочных материалов, мебели и декора' }
    ]
    return (
        <section id="services" className="content-section">
            <div className="section-container">
                <h2 className="section-title">НАШИ УСЛУГИ</h2>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function AboutSection() {
    return (
        <section id="about" className="content-section about-section">
            <div className="section-container">
                <h2 className="section-title">О КОМПАНИИ</h2>
                <div className="about-content">
                    <p className="about-paragraph">
                        <strong>Design company</strong> — это команда профессиональных дизайнеров интерьера с многолетним опытом работы.
                        Мы создаем уникальные пространства, которые отражают индивидуальность наших клиентов и отвечают их образу жизни.
                    </p>
                    <p className="about-paragraph">
                        За годы работы мы реализовали более 500 проектов различной сложности — от небольших студий до просторных загородных домов и коммерческих объектов.
                    </p>
                    <div className="about-features">
                        <div className="feature-item">
                            <span className="feature-number">500+</span>
                            <span className="feature-label">Реализованных проектов</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-number">10</span>
                            <span className="feature-label">Лет на рынке</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-number">50+</span>
                            <span className="feature-label">Наград и премий</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function Footer() {
    return (
        <footer id="contacts" className="site-footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-column">
                        <div className="footer-logo">
                            Design company
                        </div>
                        <p className="footer-description">
                            Профессиональные дизайнеры интерьера. Создаем уникальные пространства с 2014 года.
                        </p>
                        <div className="footer-socials">
                            {}
                            <a href="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                            </a>

                            {}
                            <a href="https://instagram.com/vernikodov" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>

                            {}
                            <a href="https://t.me/vernikodov" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Telegram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-title">НАВИГАЦИЯ</h3>
                        <ul className="footer-links">
                            <li><a href="#services" className="footer-link">Услуги</a></li>
                            <li><a href="#about" className="footer-link">О компании</a></li>
                            <li><a href="#contacts" className="footer-link">Контакты</a></li>
                            <li><a href="#" className="footer-link">Политика конфиденциальности</a></li>
                            <li><a href="#" className="footer-link">Договор оферты</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-title">КОНТАКТЫ</h3>
                        <ul className="footer-contact-list">
                            <li className="footer-contact-item">
                                <span className="contact-label">ТЕЛЕФОН:</span>
                                <a href="tel:+79999999999" className="contact-link">+7 (999) 999-99-99</a>
                            </li>
                            <li className="footer-contact-item">
                                <span className="contact-label">E-MAIL:</span>
                                <a href="mailto:info@vernikodov.ru" className="contact-link">info@vernikodov.ru</a>
                            </li>
                            <li className="footer-contact-item">
                                <span className="contact-label">АДРЕС:</span>
                                <span className="contact-text">г. Москва, ул. Примерная, д. 123</span>
                            </li>
                            <li className="footer-contact-item">
                                <span className="contact-label">РЕЖИМ РАБОТЫ:</span>
                                <span className="contact-text">Пн-Пт: 9:00–20:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">© 2026–{new Date().getFullYear()} VERNIKODOV. Все права защищены.</p>
                    <a href="/admin" className="admin-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                        Админ-панель
                    </a>
                </div>
            </div>
        </footer>
    )
}


function App() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [started, setStarted] = useState(false)
    const [step, setStep] = useState(1)
    const [answers, setAnswers] = useState({})
    const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', comment: '', agree: false })
    const [success, setSuccess] = useState(false)


    useEffect(() => {
        if (started) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [started])

    const handleStart = () => setStarted(true)

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1)
        } else {
            setStarted(false)
        }
    }

    const handleNext = () => {
        if (step < 5) setStep(step + 1)
        else setStep(6)
    }

    const handleAnswer = (value) => setAnswers(prev => ({ ...prev, [`step_${step}`]: value }))

    const handleContactChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = value;

        if (name === 'name') {
            finalValue = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s']/g, '');
        }

        if (name === 'phone') {
            if (value === '') {
                finalValue = '';
            } else {
                finalValue = formatPhone(value);
            }
        }

        setContactForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : finalValue
        }));
    };

    const handlePhoneKeyDown = (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            const input = e.target;
            const currentValue = input.value;
            const cursorPos = input.selectionStart;

            if (input.selectionStart !== input.selectionEnd) return;

            if (e.key === 'Backspace' && cursorPos > 0) {
                const before = currentValue.substring(0, cursorPos - 1);
                const after = currentValue.substring(cursorPos);
                const newValue = before + after;
                const numbersOnly = newValue.replace(/\D/g, '');

                if (numbersOnly.length === 0) {
                    setContactForm(prev => ({ ...prev, phone: '' }));
                } else {
                    const formatted = formatPhone(newValue);
                    setContactForm(prev => ({ ...prev, phone: formatted }));
                    setTimeout(() => {
                        input.selectionStart = input.selectionEnd = cursorPos - 1;
                    }, 0);
                }
                e.preventDefault();
            }
        }
    };

    const formatPhone = (value) => {
        let numbers = value.replace(/\D/g, '');
        if (numbers.length === 0) return '';
        if (numbers[0] === '8') numbers = '7' + numbers.substring(1);
        if (numbers[0] !== '7') numbers = '7' + numbers;
        numbers = numbers.substring(0, 11);

        let formatted = '';
        if (numbers.length > 0) formatted = '+7';
        if (numbers.length > 1) formatted += ' (' + numbers.substring(1, 4);
        if (numbers.length >= 4) formatted += ')';
        if (numbers.length > 4) formatted += ' ' + numbers.substring(4, 7);
        if (numbers.length > 7) formatted += ' ' + numbers.substring(7, 9);
        if (numbers.length > 9) formatted += ' ' + numbers.substring(9, 11);

        return formatted;
    };

        const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contactForm.name || !contactForm.phone || !contactForm.agree) {
            alert('Пожалуйста, укажите ваше имя, заполните телефон и дайте согласие на обработку данных.');
            return;
        }

        const getUtmSource = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('utm_source') || '';
        };

        const payload = {
            name: contactForm.name.trim(),
            phone: contactForm.phone.trim(),
            email: contactForm.email?.trim() || '',
            comment: contactForm.comment?.trim() || '',
            room_type: answers['step_1'] || '',
            zones: Array.isArray(answers['step_2']) ? answers['step_2'] : [],
            area: Number(answers['step_3']) || 60,
            style: answers['step_4'] || '',
            budget: answers['step_5'] || '',
            utm_source: getUtmSource()
        };

        setIsSubmitting(true); 
        try {
            const response = await fetch('http://localhost:8000/quiz/result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            setSuccess(true);
        } catch (err) {
            console.error('Ошибка отправки заявки:', err);
            alert('Не удалось отправить заявку. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isNextDisabled = () => {
        if (step === 2) {
            const val = answers[`step_${step}`];
            return !val || val.length === 0;
        }
        if (step === 3) return false;
        return !answers[`step_${step}`];
    }

    const isFormValid = () => {
        const phoneDigitsOnly = contactForm.phone.replace(/\D/g, '')
        return contactForm.name && contactForm.phone && phoneDigitsOnly.length === 11 && contactForm.agree
    }

    const currentData = QUIZ_DATA.find(d => d.id === step)
    const stepData = step === 2 && answers['step_1']
        ? { ...currentData, options: OPTIONS_BY_TYPE[answers['step_1']] || currentData.options }
        : currentData;


    const renderStep1Cards = () => (
        <div className="options-grid-step-1">
            {QUIZ_DATA[0].options.map((opt, idx) => (
                <div
                    key={idx}
                    className={`option-card ${answers['step_1'] === opt ? 'selected' : ''}`}
                    onClick={() => handleAnswer(opt)}
                >
                    <div className="card-image-wrapper">
                        <img src={TYPE_IMAGES[opt]} alt={opt} />
                        {answers['step_1'] === opt && <div className="check-overlay">✓</div>}
                    </div>
                    <span className="card-title">{opt}</span>
                </div>
            ))}
        </div>
    )

    const renderStep2Cards = () => {
        const currentSelection = answers[`step_2`] || []
        const options = OPTIONS_BY_TYPE[answers['step_1']] || QUIZ_DATA[1].options

        const toggleCheck = (opt) => {
            let newSelection = [...currentSelection]
            if (opt === "Полностью всё помещение") {
                if (newSelection.includes(opt)) newSelection = []
                else newSelection = [...options]
            } else {
                if (newSelection.includes("Полностью всё помещение")) {
                    newSelection = newSelection.filter(item => item !== "Полностью всё помещение")
                }
                if (newSelection.includes(opt)) newSelection = newSelection.filter(item => item !== opt)
                else newSelection.push(opt)
            }
            handleAnswer(newSelection)
        }

        return (
            <div className="options-grid-step-1">
                {options.map((opt, idx) => {
                    const isChecked = currentSelection.includes(opt)
                    return (
                        <div key={idx} className={`option-card ${isChecked ? 'selected' : ''}`} onClick={() => toggleCheck(opt)}>
                            <div className="card-image-wrapper">
                                <img src={ZONE_IMAGES[opt]} alt={opt} />
                                {isChecked && <div className="check-overlay">✓</div>}
                            </div>
                            <span className="card-title">{opt}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderStep3Range = (data) => {
        const val = answers[`step_3`] !== undefined ? answers[`step_3`] : data.defaultValue
        const size = 140 + (val - data.min) * ((280 - 140) / (data.max - data.min))

        return (
            <div className="range-container">
                <div className="area-visualizer">
                    <div className="area-box" style={{ width: `${size}px`, height: `${size}px` }}>
                        <span className="area-text">{val} м²</span>
                    </div>
                </div>
                <div className="slider-wrapper">
                    <input
                        type="range"
                        min={data.min}
                        max={data.max}
                        step={data.step}
                        value={val}
                        onChange={(e) => handleAnswer(Number(e.target.value))}
                    />
                    <div className="slider-labels">
                        <span>{data.min} м²</span>
                        <span>{data.max} м²</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderStep4Cards = () => (
        <div className="options-grid-step-1">
            {QUIZ_DATA[3].options.map((opt, idx) => (
                <div
                    key={idx}
                    className={`option-card ${answers['step_4'] === opt ? 'selected' : ''}`}
                    onClick={() => handleAnswer(opt)}
                >
                    <div className="card-image-wrapper">
                        <img src={STYLE_IMAGES[opt]} alt={opt} />
                        {answers['step_4'] === opt && <div className="check-overlay">✓</div>}
                    </div>
                    <span className="card-title">{opt}</span>
                </div>
            ))}
        </div>
    )

    return (
        <div className="page-wrapper">
            <div className={`page-content ${started ? 'blurred' : ''}`}>
                <Header />
                <div className="app-container">
                    <div className="start-screen">
                        <div className="start-content">
                            <h1 className="start-title">ПРОЙДИТЕ ТЕСТ И УЗНАЙТЕ СТОИМОСТЬ ДИЗАЙН-ПРОЕКТА ЗА 2 МИНУТЫ</h1>
                        </div>
                        <button className="house-btn" onClick={handleStart}>
                            <span className="btn-text">НАЧАТЬ ТЕСТ</span>
                        </button>
                    </div>
                </div>
                <ServicesSection />
                <AboutSection />
                <Footer />
            </div>

            {started && (
                <div className="quiz-overlay">
                    <div className={`quiz-wrapper ${success ? 'success-mode' : ''}`}>
                        {}
                        {!success && (
                            <button
                                className="quiz-close-btn"
                                onClick={() => setStarted(false)}
                                aria-label="Закрыть тест"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}

                        {success ? (
                            <div className="success-screen">
                                <h2 className="success-title">СПАСИБО ЗА ОТВЕТЫ!</h2>
                                <p>Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
                                <button
                                    className="success-btn"
                                    onClick={() => {
                                        setSuccess(false)
                                        setStarted(false)
                                        setStep(1)
                                        setAnswers({})
                                        setContactForm({ name: '', phone: '', email: '', comment: '', agree: false })
                                    }}
                                >
                                    ЗАКРЫТЬ
                                </button>
                            </div>
                        ) : (
                            <div className="quiz-left">
                                {step === 6 ? (
                                    <>
                                        <div className="quiz-header">МЫ УЖЕ ПРИСТУПИЛИ К РАСЧЁТУ!</div>
                                        <div className="question-title">
                                            Укажите ваши контактные данные для получения результата расчёта
                                        </div>
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <input type="text" name="name" className="form-input" placeholder="Имя" required value={contactForm.name} onChange={handleContactChange} />
                                            </div>
                                            <div className="form-group">
                                                <input type="tel" name="phone" className="form-input" placeholder="Номер телефона" required value={contactForm.phone} onChange={handleContactChange} onKeyDown={handlePhoneKeyDown} />
                                            </div>
                                            <div className="form-group">
                                                <input type="email" name="email" className="form-input" placeholder="E-mail (необязательно)" value={contactForm.email} onChange={handleContactChange} />
                                            </div>
                                            <div className="form-group">
                                                <textarea name="comment" className="form-input" rows="2" placeholder="Комментарий" value={contactForm.comment} onChange={handleContactChange}></textarea>
                                            </div>
                                            <label className="form-checkbox">
                                                <input type="checkbox" name="agree" checked={contactForm.agree} onChange={handleContactChange} />
                                                <span>Я даю согласие на обработку персональных данных</span>
                                            </label>

                                            <div className="progress-container" style={{ marginTop: '30px' }}>
                                                <span className="progress-text">Шаг 6 из 6</span>
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{ width: '100%' }}></div>
                                                </div>
                                            </div>

                                            <div className="quiz-footer" style={{ marginTop: '15px' }}>
                                                <button type="button" className="btn-nav" onClick={() => setStep(5)}>← НАЗАД</button>
                                                <button type="submit" className="btn-nav primary" disabled={!isFormValid() || isSubmitting}>
                                                    {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ'}</button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <div className="quiz-header">УЗНАЙТЕ СТОИМОСТЬ ДИЗАЙН-ПРОЕКТА</div>
                                        <div className="question-title">{stepData.title}</div>

                                        {step === 1 && renderStep1Cards()}
                                        {step === 2 && renderStep2Cards()}
                                        {step === 3 && renderStep3Range(stepData)}
                                        {step === 4 && renderStep4Cards()}

                                        {step === 5 && (
                                            <div className="options-list">
                                                {stepData.options.map((opt, idx) => (
                                                    <label key={idx} className="option-item">
                                                        <input
                                                            type="radio"
                                                            name={`q_${step}`}
                                                            value={opt}
                                                            checked={answers[`step_${step}`] === opt}
                                                            onChange={() => handleAnswer(opt)}
                                                        />
                                                        <span className="option-icon"></span>
                                                        {opt}
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        <div className="quiz-footer">
                                            <div className="progress-container">
                                                <span className="progress-text">Шаг {step} из 6</span>
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{ width: `${(step / 6) * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="nav-buttons">
                                                <button className="btn-nav" onClick={handlePrev}>{step === 1 ? '← Закрыть' : '←'}</button>
                                                <button className="btn-nav primary" onClick={handleNext} disabled={isNextDisabled()}>ДАЛЕЕ</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default App