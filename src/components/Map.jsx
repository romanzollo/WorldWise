import { useNavigate, useSearchParams } from 'react-router-dom';

import styles from './Map.module.css';

function Map() {
    // извлекаем параметры из URL
    const [searchParams, setSearchParams] = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // навигация
    const navigate = useNavigate();

    return (
        <div className={styles.mapContainer} onClick={() => navigate('form')}>
            <h1>Map</h1>
            <p>
                Position: {lat}, {lng}
            </p>
        </div>
    );
}

export default Map;
