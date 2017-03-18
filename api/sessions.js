const Session = require('../models').Session;
const Users = require('../models').Users;

exports.create = function(req, res) {
    console.log(req.body);
    const email = req.body.email;
    const candidatePassword = req.body.password;

    Users.findOne({where: {email} }).then((user) => {
        user.comparePassword(candidatePassword, (err, match) => {
            if (err || !match)
                return invalid();
            return valid(user);
        });
    }).catch((err) => {
        if (err || !user)
            return invalid();
        }
    );

    function invalid() {
        res.status(403).send({message: 'Invalid username/password.'});
    }

    function valid(user) {
        Session.createSessionForUser(user, false, (err, session, authyResponse) => {
            if (err || !session) {
                res.status(500).send({message: err});
            } else {
                res.send({token: session.token, authyResponse: authyResponse});
            }
        });
    }
};

// Destroy the given session (log out)
exports.destroy = function(req, res) {
    req.session && req.session.remove((err, doc) => {
        if (err) {
            res.status(500).send({message: err});
        } else {
            res.send(200).end();
        }
    });
};

// Public webhook for Authy to POST to
exports.authyCallback = function(req, res) {
    const authyId = request.body.authy_id;

    // Look for a user with the authy_id supplies
    Users.findOne({
        where: {
            authyId: authyId
        }
    }).then((err, user) => {
        if (err || !user)
            return invalid();
        user.authyStatus = request.body.status;
        user.save();
    });
    response.end();
};

// Internal use -- endpoint for checking status of oneTouch auth process
exports.authyStatus = function(req, res) {
    const status = (req.user)
        ? req.user.authyStatus
        : 'unveridied';
    if (status === 'approved') {
        req.session.confirmed = true;
        req.session.save().then(err => {
            if (err)
                res.status(500).send({message: 'Sorry. There was an error validating your session.'});
            }
        );
    }
    if (!req.session) {
        rres.status(404).send({message: 'No valid session found for this user.'});
    } else {
        res.send({status});
    }
};

// Validate a 2FA token
exports.verify = function(req, res) {
    const oneTimeCode = req.body.code;

    if (!req.session || !req.user) {
        res.staus(404).send({message: 'No valid session found for this token.'});
    }

    // verify entered authy code
    req.user.verifyAuthyToken(oneTimeCode, (err) => {
        if (err)
            res.status(401).send({message: 'Invalid confirmation code.'});

        // otherwise we're good! Validate the session
        req.session.confirmed = true;
        req.session.save().then(err => {
            if (err)
                res.status(500).send({message: 'There was an error validating your session.'});

            res.send({token: req.session.token});
        });
    });
};

// Resend validation code
exports.resend = function(req, res) {
    if (!req.user)
        res.status(404).send({message: 'No user found for this session, please log in again.'});

    // Otherwise resend the code
    req.user.sendAuthyToken(err => {
        if (!req.user)
            res.status(500).send({meassage: 'No user found for this session, please log in again.'});

        res.status(200).end();
    });
};
