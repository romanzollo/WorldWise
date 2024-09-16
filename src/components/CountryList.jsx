import Spinner from './Spinner';
import Message from './Message';
import CountryItem from './CountryItem';
import { useCities } from '../hooks/useCities';

import styles from './CountryList.module.css';

function CountryList() {
    // context
    const { cities, isLoading } = useCities();

    if (isLoading) return <Spinner />;

    // если нет городов
    if (!cities.length)
        return (
            <Message message="Add your first city by clicking on a city on the map" />
        );

    // отбираем только страны выбранных городов
    // страны не повторяются
    const countries = cities.reduce((acc, city) => {
        if (!acc.map((el) => el.country).includes(city.country))
            return [...acc, { country: city.country, emoji: city.emoji }];
        else return acc;
    }, []);

    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem country={country} key={crypto.randomUUID()} />
            ))}
        </ul>
    );
}

export default CountryList;
