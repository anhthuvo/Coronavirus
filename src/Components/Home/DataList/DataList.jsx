import React from 'react';
import { Card, Row, Col } from 'antd';

function DataList(props) {
    const { numberByStatus, country } = props;
    if (JSON.stringify(numberByStatus) === "{}") return <h2 style={{ textAlign: 'center' }}>No informantion</h2>;

    const renderList = () => {
        return Object.keys(numberByStatus).map((status, index) => {
            return (
                    <Col xs={24} sm={24} md={8} lg={8} xl={8} key={index}>
                        <div>
                            <Card title={`Total ${status}`} bordered={true}>
                                <h1>
                                    {numberByStatus[status]}
                                </h1>
                            </Card>
                        </div>
                    </Col>
            )
        })
    }

    return (
        <div className="datalist">
            <h2>Country: {country}</h2>
            <Row justify="space-between" gutter={[16, 16]}>
                {renderList()}
            </Row>
        </div>
    )
}

function areEqual(prevProps, nextProps) {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default React.memo(DataList, areEqual);