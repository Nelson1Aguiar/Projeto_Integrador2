import { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import './SearchBar.css';

const SearchBar = () => {
    const [searchBar, setSearchBar] = useState('');

    const handleChange = (e) => {
        e.preventDefault();
        setSearchBar(e.target.value);
    };

    return (
        <div className='SearchBar'>
            <div className='iconSearchbar'>
                <IoSearchOutline className='icoSearch' />
            </div>
                <input
                    className='inputSearchBar'
                    type="text"
                    placeholder="Pesquisar"
                    value={searchBar}
                    onChange={handleChange} />
        </div>
    );
};

export default SearchBar;

