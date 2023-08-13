import React from 'react'
import { Input, Select, Button, Form, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import RESOURCES from '../Configs/Resources.config.json'
const { Option } = Select

const SearchParameterSelector = ({ querys, setQuerys }) => {
    const [form] = Form.useForm()
    const onChange = () => {
        const parameters = form.getFieldValue('parameters')
        setQuerys({ ...querys, parameters })
    }

    const options = RESOURCES.find((res) => res.type === querys.resourceType)?.cols.filter((col) => col.label !== 'id')

    return (
        <Form form={form} onValuesChange={onChange}>
            <Form.List name="parameters">
                {(fields, { add, remove }) => (
                    <Space direction="vertical">
                        {fields.map((field, index) => (
                            <Space align="baseline" key={field.key}>
                                <Form.Item
                                    {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please fill or delete this field.',
                                        },
                                    ]}
                                    name={[field.name, 'parameter']}
                                >
                                    <Select placeholder="Select a Parameter" showSearch style={{ minWidth: '10rem' }}>
                                        {options?.map(({ label }) => (
                                            <Option value={label} key={label}>
                                                {label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please fill or delete this field.',
                                        },
                                    ]}
                                    name={[field.name, 'value']}
                                >
                                    <Input placeholder="Input a value" />
                                </Form.Item>

                                <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Parameter
                            </Button>
                        </Form.Item>
                    </Space>
                )}
            </Form.List>
        </Form>
    )
}

export default SearchParameterSelector
