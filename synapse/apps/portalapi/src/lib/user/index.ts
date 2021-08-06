import * as express from 'express';

var userApiRouter = express.Router({mergeParams: true})

userApiRouter.route('/login').post((req, res) => {

    try {
        var username = req.body.username;
        var password = req.body.password;
    } catch (error) {
        res.status(500).json({
            error: "Username or Password not provided"
        });
        return;
    }
    

    // get user info....
    var userInfo = {
        username: 'olena',
        country: 'australia',
        password: '123'
    };

    res.json({
        username: userInfo['username'],
        country:  userInfo['country'],
        token: 'admin'
    })
});

export { userApiRouter }
