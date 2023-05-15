import axios from "axios";
import { APP_ENV } from "./env";


// Створення обєкта Axios з силкою отриманою з APP_ENV.BASE_URL
const http = axios.create({
    baseURL: APP_ENV.BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

/* експорт змінної */
export default http;