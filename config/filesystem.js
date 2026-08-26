module.exports = {
    avatars : {
        dest : '/uploads/avatars',
        limits : {
            fileSize : 2 * 1024 * 1024
        }
    },

    code : {
        dest : './uploads/code',
        limits : {
            fileSize : 5 * 1024 * 1024
        }
    }
}