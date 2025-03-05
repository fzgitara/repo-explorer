'use client';

import React, { useState } from 'react';

const Content = () => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    
  };

  return (
    <div className='border border-zinc-300 p-8 rounded'>
      <input type='text' className='bg-zinc-200 border border-zinc-300 rounded p-2 mb-5 w-100' placeholder='Enter username' onChange={handleSearchChange} />
      <div>
        <button type='button' className='text-white bg-blue-500 hover:bg-blue-600 rounded p-2 w-100 cursor-pointer' onClick={handleSearchSubmit}>Search</button>
      </div>
    </div>
  )
}

export default Content;