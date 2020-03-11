import React, { useEffect } from 'react';
const io = require('socket.io-client')

interface SocketLayoutProps {
    server: string
    nsp: string
    onConnect?: (socket: any, args: any) => void
    onDisconnect?: () => void
    onData?: () => void
}

const SocketLayout: React.FC<SocketLayoutProps> = (props) => {

    const { server, nsp, onConnect, onDisconnect, children } = props

    useEffect(() => {
        const socket = io(`${server}${nsp}`, {
            query: {
                room: 'wxauth',
                uid: `c_${Math.random()}`
            },
            transports: ['websocket']
        });

        socket.on('connect', () => {
            // socket id 规则
            // nsp.name !== '/' ? nsp.name + '#' + client.id : client.id;
            let args = {}
            if (socket.id.startsWith('/') && socket.id.includes('#')) {
                // 说明带nsp 
                const sp = socket.id.split('#');
                args = { id: sp[1], nsp: sp[0].substring(1) }
            } else {
                args = { id: socket.id, nsp: '' }
            }
            socket.on(socket.id, (msg: any) => {
                console.log('#receive, ', msg)
            })
            onConnect ? onConnect(socket, args) : null;
        })

        socket.on('disconnect', () => {
            onDisconnect ? onDisconnect() : null
        })

    }, [])

    return (<>{children}</>)

}

export default SocketLayout;
