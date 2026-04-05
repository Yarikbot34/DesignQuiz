import { useState } from 'react'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogoClick = () => window.location.href = '/'

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

                    {}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ display: 'none' }}
                    >
                        ☰
                    </button>
                </div>
            </div>
        </header>
    )
}