import { useState, useCallback } from 'react'
import './SearchBar.scss'

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('')

  const handleSearch = useCallback(() => {
    onSearch(searchText)
  }, [searchText, onSearch])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  const handleClear = useCallback(() => {
    setSearchText('')
    onSearch('')
  }, [onSearch])

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search by JSON path (e.g., $.user.address.city)"
          className="search-input"
        />
        <div className="search-actions">
          {searchText && (
            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
          )}
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar