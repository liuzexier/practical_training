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
function deleteUndefindKey(pram) {
    for (key in pram) {
        if (pram[key] === undefined || pram[key] === null) {
            delete pram[key]
        }
    }
    return pram
}

module.exports = { verificationPaypin, deleteUndefindKey }