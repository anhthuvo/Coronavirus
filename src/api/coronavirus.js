import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.covid19api.com/",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getCountries = () => api.get('countries')

export const getDataByCountryAllStatus = (country, from, to) => api.get(`${process.env.REACT_APP_API_ENDPOINT}country/${country}?from=${from}&to=${to}`)

export const getSummary = () => api.get('summary')

export const getCountry = (code) => axios.get(`https://restcountries.com/v3.1/alpha/${code}`)