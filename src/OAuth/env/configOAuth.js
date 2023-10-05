const ConfigOAuth = {
    hostname: '152.38.3.103',
    port: '8081',
    http: 'http',
    tokenEndpoint: '/realms/medical-server/protocol/openid-connect/token',
    authEndpoint: '/realms/medical-server/protocol/openid-connect/auth',
    userinfoEndpoint: '/realms/medical-server/protocol/openid-connect/token/introspect',
    client_id: 'fhir',
    client_secret: 'F1lJHPZASnXn0eg7ePJy1vSC4kaKiXkM',
    scope: 'address openid',

    // hostname: '152.38.3.103',
    // port: '8081',
    // http: 'http',
    // tokenEndpoint: '/realms/medical-server/protocol/openid-connect/token',
    // authEndpoint: '/realms/medical-server/protocol/openid-connect/auth',
    // userinfoEndpoint: '/realms/medical-server/protocol/openid-connect/token/introspect',
    // client_id: 'burni',
    // client_secret: 'PAUxKiB7dJJSAo5mL0eDRcrvZAez65g6',
    // scope: 'address openid',
}

export default ConfigOAuth
