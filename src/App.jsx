import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import AppLayout from './pages/AppLayout';
import PageNotFound from './pages/PageNotFound';
import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import { CitiesProvider } from './contexts/CitiesContext';
import { AuthProvider } from './contexts/FakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <CitiesProvider>
                <BrowserRouter>
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
                            <Route path="countries" element={<CountryList />} />
                            <Route path="form" element={<Form />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>
            </CitiesProvider>
        </AuthProvider>
    );
}

export default App;
