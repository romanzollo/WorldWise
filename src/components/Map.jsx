import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from 'react-leaflet';

import { useCities } from '../hooks/useCities';
import { useGeolocation } from '../hooks/useGeolocation';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Button from './Button';

import styles from './Map.module.css';

function Map({ elRef }) {
    const { cities } = useCities();
    const [mapPosition, setMapPosition] = useState({ lat: 40, lng: 0 });
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocation();

    // достаем данные из URL через кастом хук useUrlPosition
    const [mapLat, mapLng] = useUrlPosition();

    // при первом рендере устанавливаем позицию карты
    // и в дальнейшем меняем ее при изменении параметров URL(mapLat, mapLng)
    useEffect(() => {
        if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng]);

    // синхронизируем позицию карты при изменении позиции геолокации
    useEffect(() => {
        if (geolocationPosition)
            setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }, [geolocationPosition]);

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? 'Loading...' : 'Get your position'}
                </Button>
            )}
            <MapContainer
                className={styles.map}
                center={mapPosition}
                zoom={6}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker
                        position={[city.position.lat, city.position.lng]}
                        key={city.id}
                    >
                        <Popup>
                            <span>{city.emoji}</span>{' '}
                            <span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                ))}

                {/* используем наш пользовательский компонент */}
                <ChangeCenter position={mapPosition} />
                <DetectClick elRef={elRef} />
            </MapContainer>
        </div>
    );
}

// чтобы изменить позицию карты через leaflet library
// нужно создать пользовательский компонент который будет это делать
// и затем его использовать
function ChangeCenter({ position }) {
    // используем хук leaflet
    const map = useMap();

    map.setView(position);

    // т.к. это компонент, он должен возвращать какой нибудь jsx
    // null - допустимый jsx
    return null;
}

// создаем пользовательский компонент для отслеживания нажатия на карте
function DetectClick({ elRef }) {
    // навигация
    const navigate = useNavigate();

    // используем хук leaflet
    useMapEvents({
        // достаем данные из объекта события и передаем их в navigate при клике на карте
        click: (e) => {
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
            elRef?.current?.scrollIntoView({ behavior: 'smooth' });
        },
    });
}

export default Map;
