import { FiSearch } from "react-icons/fi";
import Input from "./Input";

function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      iconLeft={<FiSearch />}
      className={className}
    />
  );
}

export default SearchBar;