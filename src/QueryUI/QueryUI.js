import React, { useState, useEffect } from 'react'
import HTTPSelector from '../Component/HTTPSelector'
import ServerURL from '../Component/ServerURL'
import ResourceTypeSelector from '../Component/ResourceTypeSelector'
import QueryID from '../Component/QueryID'
import SortBy from '../Component/SortBy'
import SearchParameterSelector from '../Component/SearchParameterSelector'
import Token from '../Component/Token'

import { Input, Descriptions, Button, Slider, Space, Checkbox } from 'antd'
import { AlignLeftOutlined } from '@ant-design/icons'
const { TextArea } = Input

const QueryUI = ({ querys, setQuerys, sendRequest, onHandelOAuth, onReset, inputJson, setInputJson, intactURL }) => {
    const formatJSON = () => {
        try {
            const obj = JSON.parse(inputJson)
            const formatValue = JSON.stringify(obj, undefined, 4)
            setInputJson(formatValue)
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Descriptions title="RedPanda" bordered>
            <Descriptions.Item label="URL" span={3}>
                <Space>
                    <Input
                        addonBefore={<HTTPSelector querys={querys} setQuerys={setQuerys} />}
                        style={{ width: '50vw' }}
                        value={intactURL}
                        readOnly
                    />
                    <Button type="primary" onClick={sendRequest}>
                        Send
                    </Button>
                    <Button type="primary" danger onClick={onReset}>
                        Reset
                    </Button>
                    <Button type="primary" onClick={onHandelOAuth}>
                        onHandelOAuth
                    </Button>
                </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Server URL">
                <ServerURL querys={querys} setQuerys={setQuerys} />
            </Descriptions.Item>

            <Descriptions.Item label="Resource Type">
                <ResourceTypeSelector querys={querys} setQuerys={setQuerys} />
            </Descriptions.Item>

            <Descriptions.Item label="ID">
                <QueryID querys={querys} setQuerys={setQuerys} />
            </Descriptions.Item>

            {querys.HTTP === 'GET' && (
                <>
                    <Descriptions.Item label="Sort By">
                        <SortBy querys={querys} setQuerys={setQuerys} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Page Count" span={2}>
                        <Slider
                            value={querys.pageCount}
                            min={5}
                            max={200}
                            step={5}
                            onChange={(value) => setQuerys({ ...querys, pageCount: value })}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Search Parameters" span={1}>
                        <SearchParameterSelector querys={querys} setQuerys={setQuerys} />
                    </Descriptions.Item>
                </>
            )}

            <Descriptions.Item label="Token" span={4}>
                <Token querys={querys} setQuerys={setQuerys} />
            </Descriptions.Item>

            {querys.HTTP === 'POST' || querys.HTTP === 'PUT' ? (
                <Descriptions.Item label="JSON" span={4}>
                    <Button style={{ marginBottom: '1rem' }} icon={<AlignLeftOutlined />} onClick={formatJSON}>
                        Format
                    </Button>
                    <TextArea
                        rows={15}
                        placeholder="input JSON"
                        value={inputJson}
                        onChange={(e) => {
                            setInputJson(e.target.value)
                        }}
                    />
                </Descriptions.Item>
            ) : (
                <></>
            )}
        </Descriptions>
    )
}

export default QueryUI
