import { useNavigate } from 'react-router-dom';
import Button from './Button';

function BackButton() {
    // навигация
    const navigate = useNavigate();

    return (
        <Button
            type="back"
            onClick={(e) => {
                // отменяем стандартное поведение браузера
                // в том числе и для того чтобы при нажатии этой кнопки в форме
                // форма не отправляла submit
                e.preventDefault();

                navigate(-1);
            }}
        >
            &larr; Back
        </Button>
    );
}

export default BackButton;
