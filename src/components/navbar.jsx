import {NavLink} from 'react-router'
function Navbar() {
    return (
        <nav style={{padding: '.4rem', position: 'fixed', top: '0px', width: '100vw',display: 'flex', justifyContent: 'center', gap: '2rem', fontWeight: 'bold', background: '#535353ff'}}>
            <NavLink to='/' style={{textDecoration: 'none', color: '#FFF'}}>Home</NavLink>
            <NavLink to='/recommend' style={{textDecoration: 'none', color: '#FFF'}}>Recomendação</NavLink>
            <NavLink to='/knowledge-base' style={{textDecoration: 'none', color: '#FFF'}}>Adicionar regra</NavLink>
        </nav>
    )
}

export default Navbar;