import { Select } from 'antd'
import RESOURCES from '../Configs/Resources.config.json'
const { Option } = Select

const SortBy = ({ querys, setQuerys }) => {
    const options = RESOURCES.find((res) => res.type === querys.resourceType)?.cols

    return (
        <Select
            showSearch
            placeholder="Select a sortBy"
            optionFilterProp="children"
            onChange={(value) => setQuerys({ ...querys, sortBy: value })}
            value={querys.sortBy}
            style={{ width: '100%' }}
        >
            {options?.map(({ label, key }) => (
                <Option value={label} key={key}>
                    {label}
                </Option>
            ))}
        </Select>
    )
}

export default SortBy
