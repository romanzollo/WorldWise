import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CitiesProvider } from './contexts/CitiesContext';
import { AuthProvider } from './contexts/FakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

// components
import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import SpinnerFullPage from './components/SpinnerFullPage';

// lazy loading
// обязательно в конце всех импортов
// самый распостроненный вариант использовать lazy loading на страницах приложения
const Homepage = lazy(() => import('./pages/Homepage'));
const Product = lazy(() => import('./pages/Product'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Login = lazy(() => import('./pages/Login'));
const AppLayout = lazy(() => import('./pages/AppLayout'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

function App() {
    console.log(import.meta.env.VITE_API_URL);

    return (
        <AuthProvider>
            <CitiesProvider>
                <BrowserRouter>
                    {/* Suspense - (“задержка”) позволяет показать запасное содержание, пока подгружается компонент через React.lazy */}
                    <Suspense fallback={<SpinnerFullPage />}>
                        <Routes>
                            <Route index element={<Homepage />} />
                            <Route path="product" element={<Product />} />
                            <Route path="pricing" element={<Pricing />} />
                            <Route path="login" element={<Login />} />-
                            <Route
                                path="app"
                                element={
                                    /* защита от неавторизованных пользователей */
                                    <ProtectedRoute>
                                        <AppLayout />
                                    </ProtectedRoute>
                                }
                            >
                                {/* Используем компонент Navigate (из 'react-router-dom') для перехода при нажатии на кнопку 'start tracking now' сразу к адресу 'app/cities' и подсвечивания кнопки 'cities' а не просто к адресу 'app'.
                    Добавляем к компоненту Navigate 'replace' чтобы можно было возвращаться назад на предыдущую страницу
                    */}
                                <Route
                                    index
                                    element={<Navigate to="cities" replace />}
                                />
                                <Route path="cities" element={<CityList />} />
                                {/* указываем параметр и элемент который будет отображаться, если URL адрес содержит это параметр */}
                                <Route path="cities/:id" element={<City />} />
                                <Route
                                    path="countries"
                                    element={<CountryList />}
                                />
                                <Route path="form" element={<Form />} />
                            </Route>
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </CitiesProvider>
        </AuthProvider>
    );
}

export default App;
