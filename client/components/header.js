import React from 'react'
import Link from 'next/link';  // we have to wrap links in next


function Header({ currentUser }) {
  let links = currentUser ?
    [ { label: 'Sign Out', href: '/auth/signout' }] 
    :
    [
      { label: 'Sign Up', href: '/auth/signup' },
      { label: 'Sign In', href: '/auth/signin' }
    ];
  links = links.map(({ label, href }) => 
    <li key={href} className='nav-item'>
      <Link href={href}>
        <a className='nav-link'>{label}</a>
      </Link>
    </li>
  );


  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>GitTix</a>
      </Link>

      <div className='d-flex justify-content-end font-weight-bold'>
        <ul className='nav d-flex align-items-center'>
          {links}
        </ul>
      </div>
    </nav>
  )
}

export default Header;
