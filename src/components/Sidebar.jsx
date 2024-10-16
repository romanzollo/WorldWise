import { Outlet } from 'react-router-dom';
import AppNav from './AppNav';
import Footer from './Footer';
import Logo from './Logo';

import styles from './Sidebar.module.css';

function Sidebar({ elRef }) {
    return (
        <div className={styles.sidebar}>
            <Logo />
            <AppNav />

            <Outlet context={{ elRef }} />

            <Footer />
        </div>
    );
}

export default Sidebar;
