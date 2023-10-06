import React, { useState, useEffect } from 'react'
import QueryUI from './QueryUI/QueryUI'
import RESOURCES from './Configs/Resources.config.json'
import axios from 'axios'
import { Button, message, Space } from 'antd'

import JSONTable from './Component/JSONTable'
import JSONModal from './Component/JSONModal'
import { auth as OAuth } from './OAuth/script/oauth_client_credentials'
function App() {
    const [messageApi, contextHolder] = message.useMessage()

    const urlParams = new URLSearchParams(window.location.search)
    const urlParamsReference = Boolean(urlParams.get('Reference'))
    const urlParamsHistory = Boolean(urlParams.get('history'))
    const HistoryID = urlParams.get('historyID') || ''
    const HistoryResourceType = urlParams.get('historyResourceType') || ''
    const AuthToken = urlParams.get('AuthToken') || ''

    const ReferenceResourceType = urlParams.get('ReferenceResourceType') || ''
    const ReferenceID = urlParams.get('ReferenceID') || ''
    const ReferenceServerURL = urlParams.get('ReferenceServerURL') || ''

    const initQuerys = {
        HTTP: 'GET',
        URLHeader: 'http://',
        serverURL: urlParamsReference ? ReferenceServerURL : '152.38.3.196:10021/fhir',
        resourceType: HistoryResourceType
            ? HistoryResourceType
            : urlParamsReference
            ? ReferenceResourceType
            : RESOURCES[0].type,
        id: HistoryID ? HistoryID : urlParamsReference ? ReferenceID : '',
        token: AuthToken ? AuthToken : '',
        sortBy: 'id',
        pageCount: 20,
        parameters: [],
        headers: [],
        history: urlParamsHistory ? '/_history' : '',
    }
    const [querys, setQuerys] = useState(initQuerys)
    const [intactURL, setIntactURL] = useState('')
    const [inputJson, setInputJson] = useState('')
    const [fetchJson, setFetchJson] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [jsonModal, setJsonModal] = useState({})

    useEffect(() => {
        const URL =
            `${querys.URLHeader}${querys.serverURL}/${querys.resourceType}` +
            (querys.id ? `/${querys.id}` : '') +
            (querys.parameters.length > 0
                ? `?${querys.parameters
                      .map((parameter) => {
                          return `${parameter?.parameter || ''}=${parameter?.value || ''}`
                      })
                      .join('&')}`
                : '') +
            querys.history
        setIntactURL(URL)
    }, [querys])

    const onReset = () => setQuerys(initQuerys)

    const onHandelOAuth = async () => {
        let authResult = await OAuth()
        if (authResult !== false) {
            setQuerys({ ...querys, token: authResult })
            console.log('isOG')
        }
    }

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a success message',
        })
    }
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'This is an error message',
        })
    }
    const warning = () => {
        messageApi.open({
            type: 'warning',
            content: 'This is a warning message',
        })
    }

    const sendRequest = async () => {
        const { HTTP, URLHeader, serverURL, resourceType, id, token, sortBy, pageCount, parameters, headers } = querys
        switch (querys.HTTP) {
            case 'GET':
                try {
                    const response = await axios.get(intactURL, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    let data = []

                    if (urlParamsHistory) {
                        data = response.data.entry?.length > 0 ? response.data.entry : []
                    } else {
                        if (querys.id) data = [{ resource: response.data }]
                        else data = response.data.entry?.length > 0 ? response.data.entry : []
                    }
                    setFetchJson(data)
                    // success()
                } catch (e) {
                    error()
                    console.log(e)
                }

                break
            case 'POST':
                try {
                    const response = await axios.post(intactURL, {
                        body: inputJson,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    // success()
                } catch (e) {
                    error()
                    console.log(e)
                }
                break
            case 'PUT':
                try {
                    const response = await axios.put(intactURL, {
                        body: inputJson,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    // success()
                } catch (e) {
                    error()
                    console.log(e)
                }
                break
            case 'DELETE':
                break
        }
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const changeJSONData = (e) => {
        setJsonModal(e)
    }

    const updateInputJson = (e) => {
        setInputJson(e)
    }

    const updateQueryData = (e) => {
        setQuerys({ ...querys, ...e })
    }

    return (
        <div style={{ padding: '1rem' }}>
            {contextHolder}
            <div>
                <QueryUI
                    querys={querys}
                    setQuerys={setQuerys}
                    onReset={onReset}
                    inputJson={inputJson}
                    setInputJson={setInputJson}
                    sendRequest={sendRequest}
                    intactURL={intactURL}
                    onHandelOAuth={onHandelOAuth}
                />
            </div>
            {querys.HTTP === 'GET' && (
                <div style={{ marginTop: '2rem' }}>
                    <JSONTable
                        openModal={openModal}
                        querys={querys}
                        changeJSONData={changeJSONData}
                        fetchJson={fetchJson}
                        updateQueryData={updateQueryData}
                        updateInputJson={updateInputJson}
                    />
                    <JSONModal
                        json={jsonModal}
                        isModalOpen={isModalOpen}
                        openModal={openModal}
                        closeModal={closeModal}
                    />
                </div>
            )}
        </div>
    )
}

export default App
