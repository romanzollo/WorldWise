import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import { useCities } from '../hooks/useCities';

import styles from './Map.module.css';

function Map() {
    const [searchParams] = useSearchParams();
    const mapLat = searchParams.get('lat');
    const mapLng = searchParams.get('lng');

    const { cities } = useCities();

    const [mapPosition, setMapPosition] = useState({ lat: 40, lng: 0 });

    // при первом рендере устанавливаем позицию карты
    // и в дальнейшем меняем ее при изменении параметров URL(mapLat, mapLng)
    useEffect(() => {
        if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng]);

    return (
        <div className={styles.mapContainer}>
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
                <DetectClick />
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
function DetectClick() {
    // навигация
    const navigate = useNavigate();

    // используем хук leaflet
    useMapEvents({
        // достаем данные из объекта события и передаем их в navigate при клике на карте
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    });
}

export default Map;
