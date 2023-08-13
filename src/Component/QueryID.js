import { Input } from 'antd'

const QueryID = ({ querys, setQuerys }) => {
    return <Input value={querys.id} onChange={(e) => setQuerys({ ...querys, id: e.target.value })} />
}

export default QueryID
