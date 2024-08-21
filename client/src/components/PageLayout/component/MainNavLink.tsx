import { Link } from 'chakra-next-link';
import { forwardRef } from 'react';
import styles from './MainNavLink.module.css';

interface Props {
  children: React.ReactNode;
  href: string;
}

export const MainNavLink = forwardRef<HTMLDivElement, Props>((props) => {
  const { href, ...rest } = props;

  return (
    <Link
      href={href}
      className={styles.mainNavLink}
      _activeLink={{ background: '#9999' }}
      {...rest}
    >
      {props.children}
    </Link>
  );
});
