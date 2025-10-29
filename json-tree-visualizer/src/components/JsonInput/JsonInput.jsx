import { useState, useCallback } from 'react'
import './JsonInput.scss'

const sampleJson = {
  user: {
    name: "John Doe",
    age: 30,
    address: {
      street: "123 Main St",
      city: "New York",
      coordinates: [40.7128, -74.0060]
    },
    hobbies: ["reading", "swimming", "coding"],
    active: true
  },
  items: [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" }
  ]
}

const JsonInput = ({ onJsonParse, onJsonError }) => {
  const [jsonText, setJsonText] = useState(JSON.stringify(sampleJson, null, 2))

  const handleVisualize = useCallback(() => {
    try {
      if (!jsonText.trim()) {
        onJsonError('Please enter JSON data')
        return
      }
      
      const parsedData = JSON.parse(jsonText)
      onJsonParse(parsedData)
    } catch (error) {
      onJsonError(`Invalid JSON: ${error.message}`)
    }
  }, [jsonText, onJsonParse, onJsonError])

  const handleClear = useCallback(() => {
    setJsonText('')
    onJsonError('')
  }, [onJsonError])

  const handleSampleLoad = useCallback(() => {
    setJsonText(JSON.stringify(sampleJson, null, 2))
  }, [])

  return (
    <div className="json-input">
      <div className="json-input-header">
        <h3>JSON Input</h3>
        <div className="json-input-actions">
          <button onClick={handleSampleLoad} className="secondary">
            Load Sample
          </button>
          <button onClick={handleClear} className="secondary">
            Clear
          </button>
        </div>
      </div>
      
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder="Paste your JSON here..."
        className="json-textarea"
      />
      
      <button onClick={handleVisualize} className="primary visualize-btn">
        Visualize JSON
      </button>
    </div>
  )
}

export default JsonInput