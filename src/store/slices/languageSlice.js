import { createSlice } from '@reduxjs/toolkit';
import i18n from '../../i18n/config'; // We will create this next

const getInitialLanguage = () => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'en';
};

const initialState = {
    code: getInitialLanguage(),
    dir: getInitialLanguage() === 'ar' ? 'rtl' : 'ltr',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            const langCode = action.payload;
            state.code = langCode;
            state.dir = langCode === 'ar' ? 'rtl' : 'ltr';

            localStorage.setItem('language', langCode);
            document.documentElement.dir = state.dir;
            document.documentElement.lang = state.code;

            // We'll handle i18n.changeLanguage in the component or a listener, 
            // but for simplicity we can try to import the instance if possible, 
            // or just rely on the component dispatching this to also call i18n.
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
