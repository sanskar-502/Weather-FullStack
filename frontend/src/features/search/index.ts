export { SearchBar } from './components/SearchBar';

export { default as searchReducer } from './searchSlice';
export {
  setQuery,
  searchLocations,
  clearSearch,
} from './searchSlice';

export type {
  SearchState,
  Location as SearchLocation
} from './searchSlice';
