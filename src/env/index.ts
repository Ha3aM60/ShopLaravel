/* створюється змінна яка отримує значення в вигляді силкі на БД */
const BASE_URL: string = process.env.REACT_APP_BASE_URL as string

/* створення обєкту якій містить силку, для легкого використання змінної в коді */
const APP_ENV = {
    BASE_URL: BASE_URL
};

/* експорт обєкту */
export { APP_ENV }; 

