import { Div, Search } from "@vkontakte/vkui"

interface SearchPanelProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const SearchPanel = ({searchQuery, onSearchChange}: SearchPanelProps) => {
    return (
        <Div>
            <Search  value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}/>
        </Div>
    )
}

export default SearchPanel;