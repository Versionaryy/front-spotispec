import { Spin } from "antd"
import { useState } from "react"
import Navbar from "../components/navbar";
function KnowledgeBasePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState('')
    const [explicacao, setExplicacao] = useState('')

    const postRecommendation = async (formData) => {
        try {
            setIsLoading(true)

            const payload = {
                genero: formData.get("genero"),
                energia: formData.get("energia"),
                eh_curta: formData.get("curta") == null ? false : true
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/base-conhecimento`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Erro na requisição: ${response.status} ${text}`)
            }

            const data = await response.json()
            setSong(data.musica)
            setExplicacao(data.explicacao || '')
            console.log(data)
        }
        catch(e) {
            console.error(e)
            // opcional: mostrar mensagem ao usuário
        }
        finally {
            setIsLoading(false)
        }
    }

    const searchSongSpotify = async (e) => {

    }
    return(
        <>
        <Navbar/>
        <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop: '2rem'}}>
        <h1>Spotispec: recomendador de música</h1>
        <h2>Adicione músicas à base de conhecimento!</h2>
        {isLoading ? (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200}}>
                <Spin size="large" />
            </div>
        ) : (!isLoading && song == '') ? (
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); postRecommendation(fd); }} style={{display: 'flex', flexDirection: 'column'}}>
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
            <div>

            <label htmlFor="curta">Menor que 3:30 minutos</label>
            <input type="checkbox" name="curta" id="curta" />
            </div>
            <label htmlFor="genero">Digite o nome da música</label>
            <input type="search" name="musica" id=""  onChange={(e) => { e.preventDefault(); searchSongSpotify(e.target); }} style={{marginBottom: '3rem'}}/>
            <button type="submit">Enviar</button>
        </form>
        ) : (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h3>Recomendação</h3>
                <p style={{fontWeight: 700, margin: 6}}>{song}</p>
                <div style={{maxWidth: 600, textAlign: 'left'}}>
                    <strong>Explicação:</strong>
                    <p style={{marginTop: 6}}>{explicacao}</p>
                </div>
                <button onClick={() => { setSong(''); setExplicacao(''); }}>Tentar novamente</button>
            </div>
        )}
        </div>
        </>
 
    )
}

export default KnowledgeBasePage