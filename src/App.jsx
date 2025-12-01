import './App.css'
import { Link } from "react-router";
import Navbar from './components/navbar';
function App() {


  return (
    <>
            <Navbar/>
      <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop: '2rem'}}>
        <h1>Spotispec: recomendador de música</h1>
        <p>Selecione a ação de preferência: </p>
        <div>

        <Link to='/recommend' style={{backgroundColor: '#118825ff', padding: '1rem', borderRadius: '1rem', textDecoration: 'none', color: '#FFF', fontWeight: 'bold'}}>Receba uma recomendação! </Link>
        <Link to='/knowledge-base' is='' style={{backgroundColor: '#d3c911ff', padding: '1rem', borderRadius: '1rem', textDecoration: 'none', color: '#FFF', fontWeight: 'bold'}} >Adicione músicas! </Link>
        </div>
      </div>
    </>
  )
}

export default App
