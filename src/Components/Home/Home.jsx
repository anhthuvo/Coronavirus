import { DatePicker, Select, Form, Spin, Result, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { getCountries, getDataByCountryAllStatus } from '../../Axios/coronavirus.js'
import DataList from './DataList/DataList.jsx';

const { Option } = Select;
const { RangePicker } = DatePicker;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

export default function Home() {
    const [state, setstate] = useState();

    useEffect(() => {
        getCountriesData();
    }, [])

    const getCountriesData = () => {
        getCountries()
        .then(res => {
            const processedData = res.data.map(ele => {
                const { Country, Slug, ISO2 } = ele;
                return { Country, Slug, ISO2 };
            })
            .sort(function (a, b) {
                    var CountryA = a.Country.toLowerCase();
                    var CountryB = b.Country.toLowerCase();
                    if (CountryA < CountryB) return -1;
                    if (CountryA > CountryB) return 1;
                    return 0;
            });

            setstate({
                loading: false,
                error: {
                    boolean: false,
                    message: ""
                },
                countryData: processedData,
                from: undefined,
                to: undefined,
                numberByStatus: undefined,
                country: undefined,
            });
        })
        .catch(err => {
            setstate({
                countryData: [],
                from: undefined,
                to: undefined,
                numberByStatus: undefined,
                country: undefined,
                loading: false,
                error: {
                    boolean: true,
                    message: err.response?.data
                }
            });
        })
    }

    const [inputs] = Form.useForm();

    const processDataList = (data) => {
        let m = data.length - 1;
        const numberByStatus = {}

        if (data.length === 0) return { numberByStatus: {} };
        const statuses = ['Confirmed', 'Deaths', 'Recovered'];
        statuses.forEach(status => {
            numberByStatus[status] = data[m][status] - data[0][status];
        });
        return {
            numberByStatus, 
            country: data[0].Country,
            from: data[0].Date,
            to: data[m].Date
        };
    }

    const onInputChange = () => {
        const { Period, Country } = inputs.getFieldValue();
        if (!Period || !Country) return;

        let from = new Date(Period[0]._d).toISOString();
        from = from.replace(/T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9]Z/g, "T00:00:00Z");
        let to = new Date(Period[1]._d).toISOString();
        to = to.replace(/T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9]Z/g, "T00:00:00Z");

        setTimeout(() => {
            setstate({ ...state, loading: true });
            getDataByCountryAllStatus(Country, from, to)
                .then(res => {
                    setstate({
                        ...state,
                        loading: false,
                        ...processDataList(res.data),
                    });
                })
                .catch(err => {
                    console.log(err);
                    let newState = { ...state, loading: false }
                    if (err.response?.status >= 500) {
                        newState = {
                            ...newState,
                            error: {
                                boolean: true,
                                message: err.response?.data
                            }
                        };
                    }else {
                        message.error('Some errors happened');
                    }
                    setstate(newState);
                });
        }, 500);
    }

    const stringToReacComponent = (str) => {
        return <div dangerouslySetInnerHTML={{__html: str}} />
    };

    if (state === undefined) return null;
    return (
        <div className="home">
            <Spin tip="Loading..." spinning={state.loading}></Spin>
            {state.error.boolean ?
                <Result
                    status="500"
                    title={stringToReacComponent(state.error.message)}
                    subTitle="Sorry, something went wrong."
                />
                :
                <div className="container">
                    <h1 className="title">CORONA VIRUS TRACKING</h1>
                    <Form
                        form={inputs}
                        {...layout}
                        onValuesChange={() => onInputChange()}
                    >
                        <div className="countriesInput">
                            <Form.Item
                                label="Country"
                                name="Country"
                                rules={[{ required: true, message: 'Please input country!' }]}
                            >
                                <Select placeholder="Select country">
                                    {state.countryData.map((country, index) => (
                                        <Option key={country.Slug || index}>{country.Country}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="Period" label="Period"
                            rules={[{ required: true, message: 'Please input period!' }]}
                        >
                            <RangePicker allowClear={false} />
                        </Form.Item>
                    </Form>

                    <div className="result-group">
                        {state.numberByStatus && 
                        <DataList 
                        numberByStatus={state.numberByStatus}
                        country={state.country}
                         />}
                    </div>
                </div>
            }
        </div>
    )
}
