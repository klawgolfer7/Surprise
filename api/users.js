const Users = require('../models').Users;
const Session = require('../models').Session;


// Create a new User
exports.create = function(req, res) {
    const p = req.body;
    Users.create({
        userName: p.userName,
        password: p.password,
        email: p.email,
        phone: p.phone,
        countryCode: p.countryCode,
        isBiz: true
    }).then((user) => {
        // Create a pre-authorized session token for the new user
        Session.createSessionForUser(user, true, (err, sessionInstance) => {
                if (err) {
                    console.log(err) // TODO
                    res.status(500).send({message:'Your user was created but we could not log you in - please log in again.'});
                } else {
                    req.session.token = sessionInstance.token;
                    res.redirect('events');
                }
            });
    }).catch((err) => {
        console.log(err)
        if (err) res.status(500).send({message:'Error saving new user - please try again.'});
    });
};

// get info for currently logged in username
exports.getUser = function(req, res) {
    if (req.user) {
        const u = req.user;
        res.send({
            username: u.username,
            email: u.email,
            phone: u.phone
        });
    } else {
        res.status(404).send({message:'No user found for session - please log in again.'});
    }
};
