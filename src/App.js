import React, { useState, useEffect } from 'react'
import QueryUI from './QueryUI/QueryUI'
import RESOURCES from './Configs/Resources.config.json'
import axios from 'axios'

import JSONTable from './Components/JSONTable'
import JSONModal from './Components/JSONModal'

function App() {
    const urlParams = new URLSearchParams(window.location.search)
    const urlParamsReference = Boolean(urlParams.get('Reference'))
    const ReferenceResourceType = urlParams.get('ReferenceResourceType') || ''
    const ReferenceID = urlParams.get('ReferenceID') || ''
    const ReferenceServerURL = urlParams.get('ReferenceServerURL') || ''

    const initQuerys = {
        HTTP: 'GET',
        URLHeader: 'https://',
        serverURL: urlParamsReference ? ReferenceServerURL : 'hapi.fhir.tw/fhir',
        resourceType: urlParamsReference ? ReferenceResourceType : RESOURCES[0].type,
        id: urlParamsReference ? ReferenceID : '',
        token: '',
        sortBy: 'id',
        pageCount: 20,
        parameters: [],
        headers: [],
    }

    const [querys, setQuerys] = useState(initQuerys)
    const [intactURL, setIntactURL] = useState('')
    const [inputJson, setInputJson] = useState('')
    const [fetchJson, setFetchJson] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    console.log(fetchJson)

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
                : '')
        setIntactURL(URL)
    }, [querys])

    const onReset = () => setQuerys(initQuerys)
    const sendRequest = async () => {
        const { HTTP, URLHeader, serverURL, resourceType, id, token, sortBy, pageCount, parameters, headers } = querys
        switch (querys.HTTP) {
            case 'GET':
                try {
                    const response = await axios.get(intactURL)
                    let data = []
                    if (querys.id) data = [{ resource: response.data }]
                    else data = response.data.entry?.length > 0 ? response.data.entry : []
                    setFetchJson(data)
                } catch (e) {
                    console.log(e)
                }

                break
            case 'POST':
                break
            case 'PUT':
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

    return (
        <div style={{ padding: '1rem' }}>
            <div>
                <QueryUI
                    querys={querys}
                    setQuerys={setQuerys}
                    onReset={onReset}
                    inputJson={inputJson}
                    setInputJson={setInputJson}
                    sendRequest={sendRequest}
                    intactURL={intactURL}
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
                    {/* <JSONModal
                        json={JSONData}
                        isModalOpen={isModalOpen}
                        openModal={openModal}
                        closeModal={closeModal}
                    /> */}
                </div>
            )}
        </div>
    )
}

export default App
