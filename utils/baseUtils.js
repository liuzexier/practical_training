const bcrypt = require('bcrypt')
function verificationPaypin(paypass, user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(paypass, user.paypin).then(isMatch => {
            if (isMatch) {
                resolve()
            } else {
                reject()
            }
        })
    })
}

module.exports = { verificationPaypin }