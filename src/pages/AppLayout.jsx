import { useRef } from 'react';

import Sidebar from '../components/Sidebar';
import Map from '../components/Map';
import User from '../components/User';

import styles from './AppLayout.module.css';

function AppLayout() {
    const elRef = useRef(null);

    return (
        <div className={styles.app}>
            <Sidebar elRef={elRef} />
            <Map elRef={elRef} />

            <User />
        </div>
    );
}

export default AppLayout;
