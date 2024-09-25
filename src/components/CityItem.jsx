import { Link } from 'react-router-dom';
import City from './City';
import { useCities } from '../hooks/useCities';

import styles from './CityItem.module.css';

// функция для форматирования даты
// через встроенный Intl.DateTimeFormat
const formatDate = (date) =>
    new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));

function CityItem({ city }) {
    // получаем текущий город, выбранный пользователем
    const { currentCity, deleteCity } = useCities();

    const {
        cityName,
        emoji,
        date,
        id,
        position: { lat, lng },
    } = city;

    function handleDeleteCity(e) {
        e.preventDefault();

        deleteCity(id);
    }

    return (
        <li>
            <Link
                className={`${styles.cityItem} ${
                    id === currentCity.id ? styles['cityItem--active'] : ''
                }`}
                to={`${id}?lat=${lat}&lng=${lng}`}
                element={<City />}
            >
                <span className={styles.emoji}>{emoji}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>({formatDate(date)})</time>

                <button className={styles.deleteBtn} onClick={handleDeleteCity}>
                    &times;
                </button>
            </Link>
        </li>
    );
}

export default CityItem;
