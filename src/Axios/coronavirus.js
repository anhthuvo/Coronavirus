import axios from "axios";

let config = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": false
    }
}
export const getCountries = () => {
    const url = `${process.env.REACT_APP_API_ENDPOINT}countries`
    return axios.get(url,config);
}

export const getDataByCountryAllStatus = (country, from, to) => {
    const url = `${process.env.REACT_APP_API_ENDPOINT}country/${country}?from=${from}&to=${to}`;
    return axios.get(url);
}
