import React, { useState } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Button, Space, Table } from 'antd'
import { FileTextOutlined, EditOutlined, DeleteOutlined, BlockOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons'

import { capitalizeFirstLetter } from '../Utils/string.converter'

const JSONTable = ({ openModal, changeJSONData, fetchJson, querys, updateQueryData, updateInputJson, history }) => {
    const [expendedIndex, setExpendedIndex] = useState(-1)
    const [expendedColName, setExpendedColName] = useState('')
    const [expendedData, setExpendedData] = useState([])

    const expend = (index, columnName, record) => {
        const expendIndex = expendedIndex === index ? -1 : index
        const expendColName = expendedIndex === index ? '' : columnName
        setExpendedData(record)
        setExpendedIndex(expendIndex)
        setExpendedColName(expendColName)
    }

    const handleClick = (data) => {
        changeJSONData(data)
        openModal()
    }

    const switchToPUT = (record) => {
        updateQueryData({ HTTP: 'PUT', id: record.id, resourceType: record.resourceType })
        delete record['key']
        updateInputJson(JSON.stringify(record))
    }

    const switchToDELETE = (record) => {
        // updateQueryData({ HTTP: HTTP.DELETE, id: record.id, resourceType: record.resourceType })
    }

    const expandedRowRender = () => {
        const children =
            expendedData?.length > 0
                ? Object.entries(expendedData[0]).map(([key, value]) =>
                      typeof value === 'object'
                          ? {
                                // title: capitalizeFirstLetter(key),
                                dataIndex: key,
                                key: key,
                                render: (record, row, index) => {
                                    return (
                                        <Button icon={<FileTextOutlined />} onClick={() => handleClick(record)}>
                                            JSON
                                        </Button>
                                    )
                                },
                            }
                          : { title: capitalizeFirstLetter(key), dataIndex: key, key: key, ellipsis: true }
                  )
                : []
        const columns = [
            {
                title: capitalizeFirstLetter(expendedColName),
                children,
            },
        ]

        return <Table size="small" bordered columns={columns} dataSource={expendedData} pagination={false} />
    }

    const typeSwitch = ({ type, label, name, childrens }) => {
        switch (type) {
            case 'string':
                return name === 'id'
                    ? {
                          title: label,
                          dataIndex: name,
                          key: name,
                          fixed: true,
                          width: 100,
                          render: (record, row, index) => {
                              return record || <div>-</div>
                          },
                      }
                    : {
                          title: label,
                          dataIndex: name,
                          key: name,
                          width: 150,
                          render: (record, row, index) => {
                              return record || <div>-</div>
                          },
                      }
            case 'object':
                return {
                    title: label,
                    dataIndex: name,
                    key: name,
                    width: 150,
                    render: (record, row, index) => {
                        if (Array.isArray(record)) {
                            const isClicked = index === expendedIndex && expendedColName === name

                            return record ? (
                                <Button
                                    danger={isClicked}
                                    onClick={() => expend(index, name, record)}
                                    icon={isClicked ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
                                >
                                    {isClicked ? 'Close' : 'Expand'}
                                </Button>
                            ) : (
                                <div> - </div>
                            )
                        } else {
                            return record ? (
                                <Button icon={<FileTextOutlined />} onClick={() => handleClick(record)}>
                                    JSON
                                </Button>
                            ) : (
                                <div>-</div>
                            )
                        }
                    },
                }
            case 'array_string':
                return {
                    title: label,
                    key: name,
                    dataIndex: name,
                    width: 150,
                    render: (record, row, index) => {
                        return <span>{record.join(',')}</span>
                    },
                }
            case 'boolean':
                return {
                    title: label,
                    key: name,
                    dataIndex: name,
                    width: 150,
                    render: (record, row, index) => {
                        return <span>{record ? 'yes' : 'no'}</span>
                    },
                }
            case 'Reference':
                return {
                    title: label,
                    key: name,
                    dataIndex: name,
                    width: 150,
                    render: (record, row, index) => {
                        if (!record || !record.reference) {
                            return <div>-</div>
                        }
                        const recordArray = record.reference ? record.reference.split('/') : []
                        return record && record.reference ? (
                            <Link
                                target="_blank"
                                to={`?Reference=true&ReferenceResourceType=${recordArray[0]}&ReferenceID=${recordArray[1]}&ReferenceServerURL=${querys.serverURL}&AuthToken=${querys.token}`}
                            >
                                <Button icon={<BlockOutlined />} type="primary">
                                    Reference
                                </Button>
                            </Link>
                        ) : (
                            <div>-</div>
                        )
                    },
                }
            default:
                return {}
        }
    }

    const getFetchJsonKeyColumns = (jsonArray) => {
        const uniqueObject = []
        for (const obj of jsonArray) {
            // 遍历当前对象的所有键值对
            for (const [key, value] of Object.entries(obj.resource)) {
                // 如果键不存在于 uniqueObject 中，将键值对添加进去
                if (!uniqueObject.hasOwnProperty(key) && value) {
                    uniqueObject[key] = value
                }
            }
        }
        return Object.entries(uniqueObject)
            .map((item) => {
                return { key: item[0], value: item[1] }
            })
            .filter((item) => item.key !== 'resourceType')
    }
    const columns = [
        ...getFetchJsonKeyColumns(fetchJson).map((fetchKey_value) => {
            return typeSwitch({
                type: typeof fetchKey_value.value,
                label: fetchKey_value.key,
                name: fetchKey_value.key,
                childrens: [],
            })
        }),

        {
            title: 'version',
            dataIndex: 'meta',
            key: 'meta',
            fixed: 'right',
            width: 100,
            render: (record, row, index) => {
                return record.versionId
            },
        },
        {
            title: 'Actions',
            key: 'operation',
            fixed: 'right',
            width: 150,
            render: (e) => (
                <Space>
                    <Button icon={<FileTextOutlined />} onClick={() => handleClick(e)}></Button>
                    <Button icon={<EditOutlined />} onClick={() => switchToPUT(e)}></Button>
                    <Button icon={<DeleteOutlined />} onClick={() => switchToDELETE(e)}></Button>
                    <Button
                        icon={<ClockCircleOutlined />}
                        onClick={() => {
                            const url = `?history=true&historyID=${e.id}&historyResourceType=${e.resourceType}&AuthToken=${querys.token}`
                            window.open(url, '_blank')
                        }}
                    ></Button>
                </Space>
            ),
        },
    ]

    return (
        <Table
            columns={columns}
            expandable={{
                expandedRowRender,
                expandIcon: () => <></>,
            }}
            expandedRowKeys={[expendedIndex]}
            dataSource={fetchJson.map((d, i) => ({ key: i, ...d.resource }))}
            pagination={false}
            scroll={{ x: window.innerWidth, y: 500 }}
        />
    )
}

export default JSONTable
