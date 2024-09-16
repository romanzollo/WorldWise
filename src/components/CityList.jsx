import CityItem from './CityItem';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../hooks/useCities';

import styles from './CityList.module.css';

function CityList() {
    // context
    const { cities, isLoading } = useCities();

    if (isLoading) return <Spinner />;

    // если нет городов
    if (!cities.length)
        return (
            <Message message="Add your first city by clicking on a city on the map" />
        );

    return (
        <ul className={styles.cityList}>
            {cities.map((city) => (
                <CityItem city={city} key={city.id} />
            ))}
        </ul>
    );
}

export default CityList;
