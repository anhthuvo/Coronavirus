import axios from "axios";

export const getCountries = () => {
    const url = `${process.env.REACT_APP_API_ENDPOINT}countries`
    return axios.get(url);
}

export const getDataByCountryAllStatus = (country, from, to) => {
    const url = `${process.env.REACT_APP_API_ENDPOINT}country/${country}?from=${from}&to=${to}`;
    return axios.get(url);
}
