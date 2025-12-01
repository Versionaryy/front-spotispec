import { Spin } from "antd"
import { useState } from "react"
import Navbar from "../components/navbar";
import spotifyImg from "../assets/spotify.png"
function RecommendPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState(null)
    const [explicacao, setExplicacao] = useState('')
    const [erro, setErro] = useState('')

    const postRecommendation = async (formData) => {
        try {
            setIsLoading(true)

            const payload = {
                genero: formData.get("genero"),
                energia: formData.get("energia"),
                eh_curta: formData.get("curta") == null ? false : true
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/recomendacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                setErro(`Erro na requisição: ${response.status} ${text}`)
                throw new Error(`Erro na requisição: ${response.status} ${text}`)
            }

            const data = await response.json()
            console.log('Resposta completa da API:', data)
            console.log('Tipo de data:', typeof data, 'É array?', Array.isArray(data))
            
            // Se a resposta é um array, pega o primeiro elemento
            let musicData = Array.isArray(data) ? data[0] : data.musica
            
            console.log('Dados da música após extração:', musicData)
            console.log('Tipo de musicData:', typeof musicData)
            
            if (musicData && typeof musicData === 'object') {
                console.log('Validação OK, setando song e explicacao')
                setSong(musicData)
                setExplicacao(musicData.explicacao || '')
            } else {
                console.warn('Validação falhou:', { musicData, tipo: typeof musicData })
                setErro('Resposta inválida do servidor: dados da música não são um objeto')
                throw new Error('Resposta inválida do servidor: dados da música não são um objeto')
            }


        }
        catch(e) {
            console.error(e)
            setErro(e)
          
        }
        finally {
            setIsLoading(false)
        }
    }
    return(
        <>
        <Navbar/>
        <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop: '2rem'}}>
        <h1>Spotispec: recomendador de música</h1>
        <h2>Selecione o que você gostaria na sua música!</h2>
        {isLoading ? (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200}}>
                <Spin size="large" />
            </div>
        ) : erro ? (
            <div style={{color: 'red', textAlign: 'center', maxWidth: 600}}>
                <h3>Erro ao buscar recomendação</h3>
                <p>{typeof erro === 'string' ? erro : erro?.message || 'Erro desconhecido'}</p>
                <button onClick={() => { setSong(null); setExplicacao(''); setErro(''); }}>Tentar novamente</button>
            </div>
        ) : (!isLoading && song == null) ? (
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); postRecommendation(fd); }} style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="genero">Gênero da música</label>
            <select name="genero" id="genero">
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Eletrônica">Eletrônica</option>
            </select>

            <label htmlFor="energia">Energia</label>
            <select name="energia" id="energia">
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
            </select>

            <label htmlFor="curta">Menor que 3:30 minutos</label>
            <input type="checkbox" name="curta" id="curta" />
            <button type="submit">Enviar</button>
        </form>
        ) : (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h3>Recomendação</h3>
                <p style={{fontWeight: 700, margin: 6}}>{song?.titulo || 'Título'} de {song?.artista || "Artista"}</p>
                <a href={song?.spotify_url || ''} target="_blank" rel="noreferrer" style={{backgroundColor: '#118825ff', padding: '0.75rem 1rem', borderRadius: '1rem', textDecoration: 'none', color: '#FFF', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
                    <img src={spotifyImg} alt="Logo do Spotify" style={{height: 20}} />
                    Escute aqui!
                </a>
                <div style={{maxWidth: 600, textAlign: 'left'}}>
                    <strong>Explicação:</strong>
                   <p style={{marginTop: 6}}>
    {typeof explicacao === 'string' ? explicacao : JSON.stringify(explicacao)}
</p>
                </div>
                <button onClick={() => { setSong(null); setExplicacao(''); }}>Fazer outra recomendação</button>
            </div>
        )}
        </div>
        </>
 
    )
}

export default RecommendPage