import InputText from "../atoms/InputText";
import {MagnifyingGlassIcon} from "../atoms/Icons";

type SearchBarProps = {
  placeholder?: string;
  handleChange?: (value: string) => void;
  value?: string;
};

const SearchBar = (
  {
    placeholder = "Search...",
    handleChange = undefined,
    value = ""
  }: SearchBarProps
) => {
  return (
    <div className="relative flex flex-column">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
        <MagnifyingGlassIcon/>
      </div>
      <InputText placeholder={placeholder} onChange={handleChange} withLeftPadding={true} value={value}/>
    </div>
  );
}

export default SearchBar;
