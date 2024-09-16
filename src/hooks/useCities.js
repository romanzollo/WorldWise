import { useContext } from 'react';

import { CitiesContext } from '../contexts/CitiesContext';

function useCities() {
    // контекстов может быть несколько
    // поэтому передовать в useContext нужно конкретный контекст
    // который нас интересует
    const context = useContext(CitiesContext);

    if (context === undefined)
        throw new Error('useCities must be used within a CitiesProvider');

    return context;
}

export { useCities };
