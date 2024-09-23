import { createContext, useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:9000';

export const CitiesContext = createContext();

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // текущий город, выбранный пользователем
    const [currentCity, setCurrentCity] = useState({});

    useEffect(() => {
        async function fetchCities() {
            try {
                setIsLoading(true);

                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            } catch {
                alert('There was an error loading data...');
            } finally {
                setIsLoading(false);
            }
        }

        fetchCities();
    }, []);

    // функция для получения данных города
    async function getCity(id) {
        try {
            setIsLoading(true);

            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);
        } catch {
            alert('There was an error loading data...');
        } finally {
            setIsLoading(false);
        }
    }

    // функция для создания города
    async function createCity(newCity) {
        try {
            setIsLoading(true);

            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            // добавляем новый город в стейт
            setCities((cities) => [...cities, data]);
        } catch {
            alert('There was an error loading data...');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider
            value={{ cities, isLoading, currentCity, getCity, createCity }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

export { CitiesProvider };
