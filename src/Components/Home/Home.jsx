import React, { useState, useEffect } from "react";
import { getSummary, getCountry } from "../../api/coronavirus.js";
import { data } from "../../data";
import { List, Card, Modal, Spin } from "antd";

const INIT_COUNTRY = {
  name: "",
  flagImg: "",
  population: "",
  capital: [],
  region: "",
  subregion: "",
};

export default function Home() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [country, setCountry] = useState(INIT_COUNTRY);

  const showModal = (code) => {
    setLoading(true);
    getCountry(code)
      .then((res) => {
        if (res.data.length === 0) throw "error";
        const {
          name: { official },
          population,
          flags: { png },
          capital,
          region,
          subregion,
        } = res.data[0];

        setCountry({
          name: official,
          flagImg: png,
          population: population,
          capital: capital,
          region: region,
          subregion: subregion,
        });

        setIsModalOpen(true);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getData = () => {
    setLoading(true);
    getSummary()
      .then((res) => {
        if (res.data?.["Countries"]) {
          let data = res.data["Countries"].sort(sortFunc);
          setList(data);
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sortFunc = (a, b) => {
    if (a.TotalConfirmed < b.TotalConfirmed) {
      return 1;
    } else if (a.TotalConfirmed > b.TotalConfirmed) {
      return -1;
    }
    if (a.TotalDeaths < b.TotalDeaths) {
      return 1;
    } else if (a.TotalDeaths > b.TotalDeaths) {
      return -1;
    }
    if (a.TotalRecovered < b.TotalRecovered) {
      return -1;
    } else if (a.TotalRecovered > b.TotalRecovered) {
      return 1;
    }
    return 0;
  }


  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="home">
        <Spin tip="Loading..." spinning={loading}></Spin>
        <div className="container">
          <h1 className="title">CORONA VIRUS TRACKING</h1>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {},
              pageSize: 9,
              showSizeChanger: false,
            }}
            grid={{ gutter: 16, column: 3 }}
            dataSource={list}
            renderItem={(item) => (
              <List.Item key={item.Country} className="">
                <Card
                  title={<p>{item.Country}</p>}
                  onClick={() => showModal(item.CountryCode.toLowerCase())}
                  className="card"
                >
                  Total Confirmed: {item.TotalConfirmed}
                  <br />
                  Total Deaths: {item.TotalDeaths}
                  <br />
                  Total Recovered: {item.TotalRecovered}
                  <br />
                </Card>
              </List.Item>
            )}
          />
        </div>
        <Modal
          title="Country"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          className="modal"
        >
          <img src={country.flagImg} className="flag" alt="flag"/>
          <p>Name: {country.name} </p>
          <p>Population: {country.population} </p>
          <p>Region: {country.region} </p>
          <p>Subregion: {country.subregion} </p>
          <p>Capital: {country.capital} </p>
        </Modal>
      </div>
    </>
  );
}
