import { Link } from 'chakra-next-link';
import { forwardRef } from 'react';
import styles from './MainNavLink.module.css';

interface Props {
  children: React.ReactNode;
  href: string;
}

export const MainNavLink = forwardRef<HTMLDivElement, Props>((props) => {
  return (
    <Link
      href={props.href}
      className={styles.mainNavLink}
      _activeLink={{ background: '#9999' }}
    >
      {props.children}
    </Link>
  );
});
