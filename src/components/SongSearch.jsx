import { useEffect, useMemo, useState } from 'react'

/**
 * SongSearch
 * - Pesquisa músicas via Fetch em `${VITE_API_URL}/pesquisa-spotify?q=...`
 * - Cancela requisições em andamento com AbortController
 * - Evita condição de corrida usando timestamp da requisição
 * - Chama `onSelect(song)` quando o usuário clica em um item
 */
export default function SongSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastRequestStartTimestamp, setLastRequestStartTimestamp] = useState(0)
  const [results, setResults] = useState(null)

  const showResults = useMemo(() => {
    return query && (loading || results)
  }, [loading, results, query])

  useEffect(() => {
    console.log(query)
    if (!query) {
      setResults(null)
      return
    }

    setLoading(true)
    const requestStartTimestamp = Date.now()
    const controller = new AbortController()

    const url = `${import.meta.env.VITE_API_URL}/pesquisa-spotify?q=${encodeURIComponent(query)}`

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `HTTP ${res.status}`)
        }
        const data = await res.json()
        console.log(data)
        
        // Extrai items da estrutura: data.musicas.tracks.items
        let items = []
        if (data?.musicas?.tracks?.items && Array.isArray(data.musicas.tracks.items)) {
          items = data.musicas.tracks.items
        } else if (Array.isArray(data)) {
          items = data
        } else if (data?.results && Array.isArray(data.results)) {
          items = data.results
        } else if (data?.tracks && Array.isArray(data.tracks)) {
          items = data.tracks
        } else if (data?.items && Array.isArray(data.items)) {
          items = data.items
        } else if (data?.musica && typeof data.musica === 'object') {
          items = [data.musica]
        }

        // evita condição de corrida
        if (requestStartTimestamp > lastRequestStartTimestamp) {
          setLastRequestStartTimestamp(requestStartTimestamp)
          setResults(items)
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error('Erro na busca de músicas:', err)
        setResults([])
      })
      .finally(() => setLoading(false))

    return () => controller.abort()

  }, [query])

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <label htmlFor="song-search">
      Pesquisar músicas
      </label>

      <input
        id="song-search"
        autoComplete="off"
        name="query"
        type="text"
        placeholder="Digite o nome da música..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: 0 }}
      />

      {showResults && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid #ddd', borderTop: 'none' }}>
          {loading && (
            <li style={{ textAlign: 'center', padding: '1rem' }}>Carregando...</li>
          )}

          {!loading && results && results.length === 0 && (
            <li style={{ textAlign: 'center', padding: '1rem' }}>Sem resultados</li>
          )}

          {!loading && results && results.map((song, idx) => {
            // Extrai dados do formato Spotify
            const title = song?.name || song?.titulo || song?.title || 'Título'
            const artist = song?.artists?.[0]?.name || song?.artista || song?.artist || 'Artista'
            const spotifyUrl = song?.external_urls?.spotify || song?.spotify_url || ''
            const albumImage = song?.album?.images?.[0]?.url || ''
            const key = song?.id || `${title}-${artist}-${idx}`

            return (
              <li 
                key={key} 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderTop: '1px solid #eee', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }} 
                onClick={() => onSelect && onSelect(song)}
              >
                {albumImage && <img src={albumImage} alt={title} style={{ width: 40, height: 40, borderRadius: 4 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>{artist}</div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
