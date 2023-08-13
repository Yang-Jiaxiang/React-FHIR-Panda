import { Input, Select } from 'antd'
const { Option } = Select

const ServerURL = ({ querys, setQuerys }) => {
    const SelectBefore = (
        <Select defaultValue="https://" onChange={(value) => setQuerys({ ...querys, URLHeader: value })}>
            <Option value="http://">http://</Option>
            <Option value="https://">https://</Option>
        </Select>
    )
    return (
        <Input
            addonBefore={SelectBefore}
            value={querys.serverURL}
            onChange={(e) => setQuerys({ ...querys, serverURL: e.target.value })}
        />
    )
}

export default ServerURL
