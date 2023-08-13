import React from 'react'
import { Select } from 'antd'
const { Option } = Select

const HTTPSelector = ({ querys, setQuerys }) => {
    return (
        <Select value={querys.HTTP} onChange={(e) => setQuerys({ ...querys, HTTP: e })}>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
        </Select>
    )
}

export default HTTPSelector
