import { useEffect, useState } from 'react';

import { useUrlPosition } from '../hooks/useUrlPosition';
import Button from './Button';
import BackButton from './BackButton';
import Message from './Message';
import Spinner from './Spinner';

import styles from './Form.module.css';

// конвертируем код страны в емодзи
export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [cityName, setCityName] = useState(''); // город
    const [country, setCountry] = useState(''); // страна
    const [emoji, setEmoji] = useState('');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [geocodingError, setGeocodingError] = useState('');

    // достаем данные из URL через кастом хук useUrlPosition
    const [lat, lng] = useUrlPosition();

    useEffect(() => {
        async function fetchCityData() {
            try {
                setIsLoadingGeocoding(true);
                setGeocodingError(''); // очищаем ошибку

                const res = await fetch(
                    `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                );
                const data = await res.json();

                // если нет кода страны, формируем ошибку
                if (!data.countryCode)
                    throw new Error(
                        "That doesn't seem to be a city. Click somewhere else and try again 😉"
                    );

                setCityName(data.city || data.locality || '');
                setCountry(data.countryName || '');
                setEmoji(convertToEmoji(data.countryCode));
            } catch (error) {
                // добавляем ошибку в стейт
                setGeocodingError(error.message);
            } finally {
                setIsLoadingGeocoding(false);
            }
        }

        fetchCityData();
    }, [lat, lng]);

    // если данные загружаются, показываем компонент Spinner
    if (isLoadingGeocoding) return <Spinner />;

    // если есть ошибка, показываем ее через компонент Message
    if (geocodingError) return <Message message={geocodingError} />;

    return (
        <form className={styles.form}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <input
                    id="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <BackButton />
            </div>
        </form>
    );
}

export default Form;
