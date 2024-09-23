import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import { useUrlPosition } from '../hooks/useUrlPosition';
import { useCities } from '../hooks/useCities';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import BackButton from './BackButton';
import Message from './Message';
import Spinner from './Spinner';

import 'react-datepicker/dist/react-datepicker.css';
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
    // достаем данные из URL через кастом хук useUrlPosition
    const [lat, lng] = useUrlPosition();
    // достаем функцию для создания города из контекста CitiesContext и состояние загрузки
    const { createCity, isLoading } = useCities();
    // навигация
    const navigate = useNavigate();

    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
    const [cityName, setCityName] = useState(''); // город
    const [country, setCountry] = useState(''); // страна
    const [emoji, setEmoji] = useState('');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [geocodingError, setGeocodingError] = useState('');

    useEffect(() => {
        // если нет координат, ничего не делаем
        if (!lat && !lng) return;

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

    // делаем функцию асинхронной
    // чтобы navigate срабатывал только после успешного создания города
    async function handleSubmit(e) {
        e.preventDefault();

        if (!cityName || !date) return;

        // формируем новый город
        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: { lat, lng },
        };

        // создаем новый город
        await createCity(newCity);
        navigate('/app/cities');
    }

    // если данные загружаются, показываем компонент Spinner
    if (isLoadingGeocoding) return <Spinner />;

    // если нет координат, показываем компонент Message
    if (!lat && !lng) return <Message message="Click somewhere on the map" />;

    // если есть ошибка, показываем ее через компонент Message
    if (geocodingError) return <Message message={geocodingError} />;

    return (
        <form
            className={`${styles.form} ${isLoading ? styles.loading : ''}`}
            onSubmit={handleSubmit}
        >
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

                {/* добавляем кастомный компонент DatePicker
                для выбора даты */}
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(data) => setDate(data)}
                    dateFormat="dd.MM.yyyy"
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
