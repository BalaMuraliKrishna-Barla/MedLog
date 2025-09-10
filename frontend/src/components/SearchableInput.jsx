import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import useDebounce from '../hooks/useDebounce.js';
import './SearchableInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchableInput = ({ onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const performSearch = async () => {
            // Trim the query to prevent searching for just spaces
            if (debouncedQuery.trim().length < 2) {
                setResults([]);
                setError('');
                return;
            }
            setLoading(true);
            setError('');
            try {
                const data = await api.searchUsers(debouncedQuery);
                setResults(data);
            } catch (err) {
                console.error("Search failed:", err);
                setError('Search failed. Please try again.');
                setResults([]);
            }
            setLoading(false);
        };
        
        performSearch();
    }, [debouncedQuery]);

    const handleSelect = (user) => {
        setQuery(''); // Clear input after selection
        setResults([]);
        onSelect(user.email); // Pass the selected email up to the parent
    };

    return (
        <div className="search-container">
            <div className="input-group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a doctor by name or email..."
                    autoComplete="off" // Prevent browser's own autocomplete
                />
                <FontAwesomeIcon icon={faSearch} className="input-icon" />
            </div>
            
            {/* Show dropdown only when there is text in the input box */}
            {query.length > 1 && (
                <div className="search-results">
                    {loading && <div className="search-loading">Searching...</div>}
                    {error && <div className="search-no-results error-message">{error}</div>}
                    {!loading && !error && results.length > 0 && results.map(user => (
                        <div key={user._id} className="search-item" onClick={() => handleSelect(user)}>
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                        </div>
                    ))}
                    {!loading && !error && results.length === 0 && debouncedQuery.length >= 2 && (
                        <div className="search-no-results">No doctors found matching your query.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableInput;