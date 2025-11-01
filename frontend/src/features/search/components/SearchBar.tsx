import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { setQuery, searchLocations, clearSearch, SearchState, Location as SearchLocation } from '../searchSlice';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { addRecent } from '../../recents/recentsSlice';
import debounce from 'lodash/debounce';
import './SearchBar.css';

export const SearchBar = memo(() => {
  const dispatch = useAppDispatch();
  const { query, results, status } = useSelector((state: RootState) => state.search as SearchState);
  const [inputValue, setInputValue] = useState(query);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchQuery: string) => {
        if (searchQuery.trim()) {
          dispatch(searchLocations(searchQuery));
        } else {
          dispatch(clearSearch());
        }
      }, 300),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        dispatch(clearSearch());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    dispatch(setQuery(value));
    debouncedSearch(value);
  }, [dispatch, debouncedSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      dispatch(clearSearch());
    }
  }, [dispatch]);

  const handleSelect = useCallback((item: SearchLocation) => {
    setInputValue(item.name);
    dispatch(setQuery(item.name));
    const id = (item as any).id || `${item.name}-${item.lat}-${item.lon}`;
    dispatch(addRecent({ id, name: item.name, lat: item.lat, lon: item.lon } as any));
    dispatch(clearSearch());
  }, [dispatch]);

  return (
    <div className="search-container" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for a city..."
          className="search-input"
          aria-label="Search for a city"
        />
        {status === 'loading' && <div className="search-loading">Loading...</div>}
      </div>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result: SearchLocation) => (
            <SearchResultItem
              key={result.id || `${result.name}-${result.lat}-${result.lon}`}
              result={result}
              onSelect={() => handleSelect(result)}
            />
          ))}
        </ul>
      )}
    </div>
  );
});

interface SearchResultItemProps {
  result: SearchLocation;
  onSelect: () => void;
}

const SearchResultItem = memo(({ result, onSelect }: SearchResultItemProps) => (
  <li className="search-result-item" onClick={onSelect} role="button" tabIndex={0}>
    <span className="city-name">{result.name}</span>
    {result.country && <span className="country-code">, {result.country}</span>}
  </li>
));

SearchBar.displayName = 'SearchBar';
SearchResultItem.displayName = 'SearchResultItem';
