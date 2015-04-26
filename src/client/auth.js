export default {
    authenticate(socket, cb) {
        // TODO: TROLLOLOLOLOL - security
        const username = localStorage.getItem('test-user') || window.prompt('Username?');
        const password = '1234';

        socket.on('authorized', function (result) {
            if (!result.authorized) {
                console.error("Couldn't authenticate, should probably do something about that");
                return;
            }

            localStorage.setItem('test-user', username);
            cb(username);
        });

        console.info(`Authenticating as ${username}`);
        socket.emit('authorize', { username, password });
    }
};
