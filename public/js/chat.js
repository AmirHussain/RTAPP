const socket = io();
// var qs = require('qs');
document.addEventListener('DOMContentLoaded', () => {
    // document.querySelector('#incrementButton').addEventListener('click', () => {
    //     console.log('client', 'count clicked')
    //     socket.emit('incremented');
    // })

    //Options
    const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    console.log(username, room);
    socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error)
            location.href = '/';
        }
    });
    const autoScroll = () => {
        var objDiv = document.getElementById("messages");
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    const messageForm = document.querySelector('#message-form')
    const messageInput = messageForm.querySelector('input')
    const messageButton = messageForm.querySelector('button')
    const messages = document.querySelector('#messages');
    const messageTemplates = document.querySelector('#message-template').innerHTML

    const locationTemplates = document.querySelector('#location-template').innerHTML
    const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

    socket.on('message', (message) => {
        console.log('client', message.text);
    })
    socket.on('countUpdated', (count) => {
        console.log('client', 'count updated' + count);
    })
    socket.on('clientMessage', (message) => {
        console.log('client', 'message', message);

        const html = Mustache.render(messageTemplates, {
            message: message.text,
            createdAt: message.createdAt,
            user: message.name,
            userClass: message.id === socket.id ? 'yellowUser' : 'blueUser',
            divClass: message.id === socket.id ? 'message-purple' : 'message-blue',
            userInitials: message.initials
        })
        messages.insertAdjacentHTML('beforeend', html)
        autoScroll()
    })

    socket.on('location', (message) => {
        console.log('client', 'location', message.url);

        const html = Mustache.render(locationTemplates, {
            location: message.url,
            createdAt: message.createdAt,
            user: message.name,
            userClass: message.id === socket.id ? 'yellowUser' : 'blueUser',
            divClass: message.id === socket.id ? 'message-purple' : 'message-blue',
            userInitials: message.initials
        })
        messages.insertAdjacentHTML('beforeend', html)

        autoScroll()
    })

    socket.on('roomData', ({ room, users }) => {
        const html = Mustache.render(sidebarTemplate, {
            room: room,
            users: users
        })
        document.querySelector('#sidebar').innerHTML = html;
    })
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault()
        messageButton.setAttribute('disabled', 'disabled');
        socket.emit('clientMessage', e.target.message.value, (result) => {
            if (result == 'success') {
                messageInput.value = ''
                console.log('message delivered')
            }
            if (result == "bad-words") {
                console.log('message can not be delivered as it contain inappropriate words')
            }

            messageButton.removeAttribute('disabled');

            messageInput.focus()
        })
    })


    const locationButton = document.querySelector('#sendLocation')
    locationButton.addEventListener('click', () => {
        locationButton.setAttribute('disabled', 'disabled')
        if (!navigator.geolocation) {
            return alert('geo location is not supported')
        }

        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)

            socket.emit('location', {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }, () => {
                console.log('location sent')
            })
            locationButton.removeAttribute('disabled')
        })
    })
}, false);

