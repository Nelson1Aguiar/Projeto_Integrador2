import { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ files, setHasPathBySearchBar, setPathToOpen }) => {
    const [searchBar, setSearchBar] = useState('');
    const [filteredFiles, setFilteredFiles] = useState(files);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchBar(value);

        const filtered = files.filter(file =>
            file.Name?.toLowerCase().includes(value.toLowerCase())
        );

        const maxResults = 5;
        const limitedResults = filtered.slice(0, maxResults);

        setFilteredFiles(limitedResults);
        setShowDropdown(value.length > 0);

        if (limitedResults.length == 0)
            setShowDropdown(false);
    };

    const handleSelect = (file) => {
        setSearchBar(file.Name);
        setPathToOpen(file.FilePath);
        setHasPathBySearchBar(true);
        setShowDropdown(false);
    };

    return (
        <div className= "SearchBarContainer">
        <div className='SearchBar'>
            <div className='iconSearchbar'>
                <IoSearchOutline className='icoSearch' />
            </div>
            <input
                className='inputSearchBar'
                type="text"
                placeholder="Pesquisar"
                value={searchBar}
                onChange={handleChange}
                onFocus={() => setShowDropdown(searchBar.length > 0)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
            </div>
            {showDropdown && (
                <ul className='searchDropdown'>
                    {filteredFiles.map((file) => (
                        <li className = "listElementsFiles" key={file.FileId} onMouseDown={() => handleSelect(file)}>{file.Name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    setHasPathBySearchBar: PropTypes.func.isRequired,
    setPathToOpen: PropTypes.func.isRequired,

    files: PropTypes.arrayOf(
        PropTypes.shape({
            FileId: PropTypes.number,
            FilePath: PropTypes.string,
            Name: PropTypes.string,
        })
    ),
};

export default SearchBar;
