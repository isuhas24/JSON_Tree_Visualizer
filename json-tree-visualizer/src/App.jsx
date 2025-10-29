import { useState, useCallback } from 'react'
import { ReactFlowProvider } from 'reactflow'
import JsonInput from './components/JsonInput/JsonInput'
import JsonTree from './components/JsonTree/JsonTree'
import SearchBar from './components/SearchBar/SearchBar'
import './App.scss'

function App() {
  const [jsonData, setJsonData] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const handleJsonParse = useCallback((data) => {
    setJsonData(data)
    setError('')
  }, [])

  const handleJsonError = useCallback((errorMessage) => {
    setError(errorMessage)
    setJsonData(null)
  }, [])

  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>JSON Tree Visualizer</h1>
      </header>
      
      <div className="app-content">
        <div className="input-section">
          <JsonInput 
            onJsonParse={handleJsonParse}
            onJsonError={handleJsonError}
          />
          {error && <div className="error-message">{error}</div>}
        </div>
        
        <div className="visualization-section">
          <SearchBar onSearch={handleSearch} />
          <div className="tree-container">
            <ReactFlowProvider>
              <JsonTree 
                jsonData={jsonData} 
                searchTerm={searchTerm}
              />
            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App