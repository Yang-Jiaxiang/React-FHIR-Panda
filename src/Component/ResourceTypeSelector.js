import React from 'react'
import { Select } from 'antd'
import RESOURCES from '../Configs/Resources.config.json'

const { Option } = Select

const ResourceTypeSelector = ({ querys, setQuerys }) => {
    return (
        <Select
            value={querys.resourceType}
            showSearch
            style={{ width: '100%' }}
            onChange={(e) => setQuerys({ ...querys, resourceType: e })}
        >
            {RESOURCES.map(({ type }) => (
                <Option value={type} key={type}>
                    {type}
                </Option>
            ))}
        </Select>
    )
}

export default ResourceTypeSelector
