import { createContext, useCallback, useEffect, useReducer } from 'react';

// DEV ONLY
const BASE_URL = 'http://localhost:9000';
// const BASE_URL = 'https://json-server-vercel-six-roan.vercel.app';

export const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                isLoading: true,
            };

        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload,
            };

        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload,
            };

        case 'city/created':
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                // устанавливаем новый город как текущий
                currentCity: action.payload,
            };

        case 'city/deleted':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter(
                    (city) => city.id !== action.payload
                ),
                // сбрасываем текущий город
                currentCity: {},
            };

        case 'rejected':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        default:
            throw new Error('Unknown action');
    }
}

function CitiesProvider({ children }) {
    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(() => {
        async function fetchCities() {
            dispatch({ type: 'loading' });

            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({ type: 'cities/loaded', payload: data });
            } catch {
                dispatch({
                    type: 'rejected',
                    payload: 'There was an error loading the cities...',
                });
            }
        }

        fetchCities();
    }, []);

    // функция для получения данных города
    // оборачиваем в useCallback чтобы не отправлять бесконечные запросы в массиве зависемости useEffect компонента City
    const getCity = useCallback(
        async function getCity(id) {
            // если выбранный город уже есть загружен
            // то повторный запрос на сервер не нужен
            if (Number(id) === currentCity.id) return;

            dispatch({ type: 'loading' });

            try {
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                dispatch({ type: 'city/loaded', payload: data });
            } catch {
                dispatch({
                    type: 'rejected',
                    payload: 'There was an error loading the city...',
                });
            }
        },
        [currentCity.id]
    );

    // функция для создания города
    async function createCity(newCity) {
        dispatch({ type: 'loading' });

        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            // добавляем новый город в стейт
            dispatch({ type: 'city/created', payload: data });
        } catch {
            dispatch({
                type: 'rejected',
                payload: 'There was an error creating the city...',
            });
        }
    }

    // функция удаления города
    async function deleteCity(id) {
        dispatch({ type: 'loading' });
        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE',
            });

            // удаляем город из стейта
            dispatch({ type: 'city/deleted', payload: id });
        } catch {
            dispatch({
                type: 'rejected',
                payload: 'There was an error deleting the city...',
            });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                // error,
                getCity,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

export { CitiesProvider };
