import { FolderKanban, LayoutDashboard, LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../modules/auth/AuthContext'

const navigation = [{ to: '/dashboard', label: 'Panel', icon: LayoutDashboard }, { to: '/projects', label: 'Proyectos', icon: FolderKanban }]

export const AppLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }
  const links = (compact = false) => navigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} aria-label={compact ? label : undefined}><Icon size={18} strokeWidth={2} /><span>{label}</span></NavLink>)

  return <div className="app-shell"><aside className="sidebar"><NavLink className="brand" to="/dashboard"><img src={logo} alt="Task Flow" /></NavLink><nav aria-label="Navegación principal">{links()}</nav><div className="profile-box"><div className="profile-name">{user?.name}</div><div className="profile-role">{user?.role === 'ADMIN' ? 'Administrador' : 'Miembro'}</div><button type="button" className="logout-link" onClick={handleLogout}><LogOut size={16} />Cerrar sesión</button></div></aside><header className="mobile-header"><NavLink className="brand" to="/dashboard"><img src={logo} alt="Task Flow" /></NavLink><nav className="mobile-nav" aria-label="Navegación principal">{links(true)}<button type="button" className="nav-link" onClick={handleLogout} aria-label="Cerrar sesión"><LogOut size={18} /></button></nav></header><main className="app-main"><div className="content-wrap"><Outlet /></div></main></div>
}
