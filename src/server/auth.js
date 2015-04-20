const LOL_USERS_TABLE = {
    "walter": "1234",
    "eric": "1234",
    "dennis": "1234",
    "jesse": "1234"
};

export default {
    authenticate: (username, password) =>
        LOL_USERS_TABLE.hasOwnProperty(username) &&
        LOL_USERS_TABLE[username] === password
};
