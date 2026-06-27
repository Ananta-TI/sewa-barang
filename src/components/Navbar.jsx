import { Bell, Heart, LogOut, Menu, Moon, Sun, User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useDemo } from '../contexts/DemoContext'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { currentUser, logout, db } = useDemo()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  const unread = db.notifications.filter((entry) => entry.user_id === currentUser?.id && !entry.read).length

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari 40px, ubah jadi dynamic island
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const doLogout = () => { 
    logout(); 
    navigate('/'); 
    setMenuOpen(false);
  }

  return (
    <>
      {/* Wrapper kosong untuk mencegah konten lompat ke atas saat navbar melayang */}
      <div style={{ height: '75px' }} className="header-spacer"></div>

      <motion.header
        className={`site-header ${isScrolled ? 'dynamic-island' : ''}`}
        initial={false}
        animate={{
          width: isScrolled ? '90%' : '100%',
          maxWidth: isScrolled ? '1100px' : '100%',
          top: isScrolled ? '20px' : '0px',
          borderRadius: isScrolled ? '100px' : '0px',
          padding: isScrolled ? '0 1rem' : '0',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          margin: '0 auto',
          zIndex: 50,
          overflow: 'visible'
        }}
      >
        <div className="container header-inner">
          <Logo />
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>Beranda</NavLink>
            <NavLink to="/jelajahi" onClick={() => setMenuOpen(false)}>Jelajahi</NavLink>
            <NavLink to="/cara-kerja" onClick={() => setMenuOpen(false)}>Cara Kerja</NavLink>
            <NavLink to="/keamanan" onClick={() => setMenuOpen(false)}>Keamanan</NavLink>
          </nav>
          
          <div className="header-actions">
            <button className="icon-button" onClick={toggleTheme} title="Ubah tema">
              {theme === 'light' ? <Moon size={19}/> : <Sun size={19}/>}
            </button>
            
            {currentUser ? (
              <>
                <Link className="icon-button indicator-wrap" to="/dashboard/favorit" title="Favorit">
                  <Heart size={19}/>
                </Link>
                <Link className="icon-button indicator-wrap" to="/dashboard/notifikasi" title="Notifikasi">
                  <Bell size={19}/>
                  {unread > 0 && <span className="indicator">{unread}</span>}
                </Link>
                <Link className="user-chip" to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                  <img src={currentUser.avatar} alt=""/>
                  <span className="desktop-only">{currentUser.name.split(' ')[0]}</span>
                </Link>
                <button className="icon-button desktop-only" onClick={doLogout} title="Keluar">
                  <LogOut size={19}/>
                </button>
              </>
            ) : (
              <>
                <Link className="button button-ghost desktop-only" to="/login">Masuk</Link>
                <Link className="button button-primary desktop-only" to="/register">Daftar</Link>
              </>
            )}
            
            <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X/> : <Menu/>}
            </button>
          </div>
        </div>
        
        {menuOpen && (
          <div className="mobile-extra container">
            {!currentUser ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}><User size={18}/> Masuk</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}><User size={18}/> Daftar</Link>
              </>
            ) : (
              <button onClick={doLogout}><LogOut size={18}/> Keluar</button>
            )}
          </div>
        )}
      </motion.header>
    </>
  )
}