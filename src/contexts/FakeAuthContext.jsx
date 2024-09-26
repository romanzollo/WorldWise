import { createContext, useContext, useReducer } from 'react';

const FAKE_USER = {
    name: 'Jack',
    email: 'jack@example.com',
    password: 'qwerty',
    avatar: 'https://i.pravatar.cc/100?u=zz',
};

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'login':
            return {
                // все равно копируем весь state так как в будущем может быть больше переменных состояния
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };

        case 'logout':
            return {
                // все равно копируем весь state так как в будущем может быть больше переменных состояния
                ...state,
                user: null,
                isAuthenticated: false,
            };

        default:
            throw new Error('Unknown action');
    }
}

function AuthProvider({ children }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState
    );

    // функция входа в аккаунт
    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({
                type: 'login',
                payload: FAKE_USER,
            });
        }
    }

    // функция выхода
    function logout() {
        dispatch({ type: 'logout' });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// custom hook
function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth };
