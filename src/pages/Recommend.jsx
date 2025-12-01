import { Spin } from "antd"
import { useState } from "react"
import Navbar from "../components/navbar";
import spotifyImg from "../assets/spotify.png"
function RecommendPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState(null)
    const [explicacao, setExplicacao] = useState('')

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
                throw new Error(`Erro na requisição: ${response.status} ${text}`)
            }

            const data = await response.json()
            if (data.musica && typeof data.musica === 'object') {
                setSong(data.musica)
                setExplicacao(data.explicacao || '')
            } else {
                throw new Error('Resposta inválida do servidor: musica não é um objeto')
            }

        }
        catch(e) {
            console.error(e)
            // opcional: mostrar mensagem ao usuário
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
                
                <p>Funcionou</p>
            </div>
        )}
        </div>
        </>
 
    )
}

export default RecommendPage