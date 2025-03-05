'use client';

import React, { useState } from 'react';
import axios from 'axios';

const url = {
  users: (limit: number, username: string) => `https://api.github.com/search/users?per_page=${limit}&q=${username}`,
  repos: (username: string) => `https://api.github.com/users/${username}/repos`
};

const Content = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [userSearch, setUserSearch] = useState<string>('');

  const [users, setUsers] = useState<object[]>([]);
  const [repos, setRepos] = useState<object[]>([]);
  const [repoOpen, setRepoOpen] = useState<number>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const respUsers = await axios.get(url.users(5, search));

    const updatedUsers: object[] = [];

    const allUserRepos = respUsers.data.items.map(user => {
      updatedUsers.push(user.login)
      return axios.get(url.repos(user.login));
    });
    setUsers(updatedUsers);

    const respRepos = await Promise.all(allUserRepos);
    setUsers(updatedUsers);
    setRepos(respRepos);
    setUserSearch(search);
    setLoading(false);
  };

  const loadingAnimation = () => {
    return <svg aria-hidden='true' className='m-auto w-6 h-6 text-gray-500 animate-spin dark:text-white fill-blue-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/><path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/></svg>;
  };

  const renderUserRepos = () => {
    return users.map((user, i) => {
      return (
        <div className='mt-3' key={`user-${i}`}>
          <button onClick={() => setRepoOpen(i)} id='dropdownDefaultButton' data-dropdown-toggle='dropdown' className='bg-neutral-100 hover:bg-neutral-200 rounded px-5 py-2 w-100 cursor-pointer flex justify-between'>
            {user}
            <div className='my-auto'>
              <svg id={`caret-icon-${i}`} className='w-2.5 h-2.5 ms-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 10 6'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 4 4 4-4'/>
              </svg>
            </div>
          </button>

          <div className={`flex justify-end ${repoOpen !== i && 'hidden'}`}>
            <div>
              {repos[i]?.data.map((repo: { name: string }, j: number) => {
                return (
                  <div id='dropdown' className='bg-neutral-200 rounded shadow-sm w-44 mt-2 w-90 p-2' key={`repo-${j}`}>
                    <div className='flex justify-between'>
                      <h1 className='font-semibold'>{repo.name}</h1>
                      <div className='flex my-auto'>
                        <span className='my-auto font-semibold'>{repo.stargazers_count}</span>
                        <svg className='mt-[3px] w-4 h-4 ms-1 text-gray-300 dark:text-gray-500' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 22 20'>
                            <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z'/>
                        </svg>
                      </div>
                    </div>
                    <p>{repo.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className='border border-zinc-300 p-8 rounded'>
      <input type='text' className='bg-zinc-200 border border-zinc-300 rounded p-2 mb-5 w-100' placeholder='Enter username' onChange={handleSearchChange} onKeyDown={handleSearchKeyDown} />
      <div>
        <button type='button' className='text-white bg-blue-500 hover:bg-blue-600 rounded p-2 w-100 cursor-pointer text-center' onClick={handleSearchSubmit}>
          {loading ? loadingAnimation() : 'Search'}
        </button>
      </div>
      {!loading && userSearch && (
        <p className='text-zinc-500 mt-5'>Showing users for {userSearch}</p>
      )}
      {!loading && users.length > 0 && renderUserRepos()}
    </div>
  )
}

export default Content;