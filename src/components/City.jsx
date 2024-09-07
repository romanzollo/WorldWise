import { useParams, useSearchParams } from 'react-router-dom';

import styles from './City.module.css';

const formatDate = (date) =>
    new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
    }).format(new Date(date));

function City() {
    // TEMP DATA
    const currentCity = {
        cityName: 'Lisbon',
        emoji: '🇵🇹',
        date: '2027-10-31T15:59:59.138Z',
        notes: 'My favorite city so far!',
    };

    const { id } = useParams();

    const { cityName, emoji, date, notes } = currentCity;

    // извлекаем параметры из URL
    const [searchParams, setSearchParams] = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    return (
        <>
            <h2>City {id}</h2>
            <p>
                Position: {lat}, {lng}
            </p>

            {/* Пример как можно динамически менять параметры  */}
            <button onClick={() => setSearchParams({ lat: 33, lng: 22 })}>
                Change position
            </button>
        </>
    );

    //   return (
    //     <div className={styles.city}>
    //       <div className={styles.row}>
    //         <h6>City name</h6>
    //         <h3>
    //           <span>{emoji}</span> {cityName}
    //         </h3>
    //       </div>

    //       <div className={styles.row}>
    //         <h6>You went to {cityName} on</h6>
    //         <p>{formatDate(date || null)}</p>
    //       </div>

    //       {notes && (
    //         <div className={styles.row}>
    //           <h6>Your notes</h6>
    //           <p>{notes}</p>
    //         </div>
    //       )}

    //       <div className={styles.row}>
    //         <h6>Learn more</h6>
    //         <a
    //           href={`https://en.wikipedia.org/wiki/${cityName}`}
    //           target="_blank"
    //           rel="noreferrer"
    //         >
    //           Check out {cityName} on Wikipedia &rarr;
    //         </a>
    //       </div>

    //     </div>
    //   );
}

export default City;
