import { Spin } from "antd"
import { useState } from "react"
import Navbar from "../components/navbar";
import SongSearch from "../components/SongSearch";
function KnowledgeBasePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null) // Música selecionada no formulário
    const [completedSong, setCompletedSong] = useState(null) // Música adicionada com sucesso
    const [error, setError] = useState('') // Mensagem de erro
    const [explicacao, setExplicacao] = useState()

    const handleSongSelect = (song) => {
        // Apenas seleciona a música, não envia o formulário
        console.log(song)

        setSelectedSong(song)
    }

    const postRecommendation = async (e) => {
        e.preventDefault()
        
        if (!selectedSong) {
            console.warn('Nenhuma música selecionada')
            return
        }

        try {
            setIsLoading(true)

            const formData = new FormData(e.target)
            const payload = {
                genero: formData.get("genero"),
                energia: formData.get("energia") === 'Média' ? 'Media' : formData.get("energia"),
                eh_curta: formData.get("curta") == null ? false : true,
                musicas: [{
                    titulo: selectedSong.name,
                    artista: selectedSong.artists[0].name || '',
                    spotify_url: selectedSong.external_urls.spotify || ''
                }]
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/aquisicao-conhecimento`, {
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
            // Só muda para a tela de sucesso após a resposta do servidor
            setCompletedSong(selectedSong)
            setExplicacao(data.explicacao || 'Música adicionada com sucesso!')
            setError('')

        }
        catch(e) {
            console.error(e)
            setError(e.message || 'Erro ao adicionar música. Tente novamente.')
            setCompletedSong(null)
        }
        finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setSelectedSong(null)
        setCompletedSong(null)
        setExplicacao('')
        setError('')
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
        ) : error ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 600}}>
                <div style={{padding: '1rem', backgroundColor: '#fee', border: '1px solid #f00', borderRadius: '4px', marginBottom: '1rem', color: '#c00', fontWeight: 'bold'}}>
                    ✗ Erro ao adicionar música
                </div>
                <p style={{marginBottom: '1rem'}}>{error}</p>
                <button onClick={resetForm} style={{padding: '0.75rem 1.5rem', backgroundColor: '#118825ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                    Voltar ao formulário
                </button>
            </div>
        ) : completedSong ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 600}}>
                <h3>✓ Música adicionada com sucesso!</h3>
                <p>{explicacao}</p>
                <button onClick={resetForm} style={{padding: '0.75rem 1.5rem', backgroundColor: '#118825ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem'}}>
                    Adicionar outra música
                </button>
            </div>
        ) : (
            <form onSubmit={postRecommendation} style={{display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500}}>
                <div>
                    <label htmlFor="genero">Gênero</label>
                    <select name="genero" id="genero" style={{width: '100%', padding: '0.5rem'}}>
                        <option value="Rock">Rock</option>
                        <option value="Pop">Pop</option>
                        <option value="Hip-Hop">Hip-Hop</option>
                        <option value="Metal">Metal</option>
                        <option value="MPB">MPB</option>
                        <option value="Sertanejo">Sertanejo</option>
                        <option value="Eletrônica">Eletrônica</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="energia">Energia</label>
                    <select name="energia" id="energia" style={{width: '100%', padding: '0.5rem'}}>
                        <option value="Alta">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="curta">
                        <input type="checkbox" name="curta" id="curta" />
                        Menor que 3:30 minutos
                    </label>
                </div>

                <div>
                    <label htmlFor="song-search-label">Selecione a música</label>
                    <SongSearch onSelect={handleSongSelect}/>
                </div>

                {selectedSong && (
                    <div style={{padding: '1rem', backgroundColor: '#000', borderRadius: '4px'}}>
                        <strong>Música selecionada:</strong>
                        <p style={{margin: '0.5rem 0'}}>{selectedSong?.name || selectedSong?.titulo} - {selectedSong?.artists?.[0]?.name || selectedSong?.artista}</p>
                    </div>
                )}

                <button type="submit" disabled={!selectedSong} style={{padding: '0.75rem', backgroundColor: selectedSong ? '#118825ff' : '#ccc', color: '#fff', border: 'none', borderRadius: '4px', cursor: selectedSong ? 'pointer' : 'not-allowed'}}>
                    Enviar
                </button>
            </form>
        )}
        </div>
        </>
 
    )
}

export default KnowledgeBasePage