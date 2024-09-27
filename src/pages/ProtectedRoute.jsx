import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/FakeAuthContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    /* children - в данном случае это AppLayout, где компонент User может не существовать если пользователь будет не авторизован и в таком случае это будет приводить к ошибке.*/
    return isAuthenticated ? children : null;
}

export default ProtectedRoute;
