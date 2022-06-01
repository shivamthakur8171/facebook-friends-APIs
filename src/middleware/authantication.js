const register = require('./../model/user');
const helper = require('./../helper/helper')


module.exports.authantication = async (req, res, next) => {
    try {

        let token = req.headers.authorization.split(' ')[1]
        // console.log(token);
        if (!token) return res.status(403).json("token is require for this route");

        const verifyToken = helper.verifyToken(token);
        // console.log(verifyToken);
        const user = verifyToken._id

        const userDetail = await register.findOne({ _id : user });
        // console.log(userDetail);

        if (!userDetail) {
            return res.status(403).json("user not found");
        }
        // console.log(token); 
        req.token = token;
        req.userDetail = userDetail;
        next();
    } catch (err) {
        res.status(401).send({
            msg: 'please verify your identity',
            err
        });
    }
}