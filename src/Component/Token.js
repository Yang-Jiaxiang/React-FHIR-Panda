import React from 'react'
import { Input } from 'antd'

const Token = ({ querys, setQuerys }) => {
    return <Input value={querys.token} onChange={(e) => setQuerys({ ...querys, token: e.target.value })} />
}

export default Token
