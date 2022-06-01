const register = require('../model/user');
const friends = require('./../model/friends');
const validator = require('../helper/validator');
const helper = require('../helper/helper');

module.exports.userRegistration = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, password, confirmPassword } = req.body;

        //check email is already register or not
        const checkEmail = await register.findOne({ email });
        if (checkEmail != null) return res.status(400).send('user already registered plz login.');

        // email validation using regex .
        if (!validator.email(email)) return res.status(400).send("please enter a email address.");

        // check password and confirm password is not matched
        if (!(password === confirmPassword)) return res.status(400).send('password and confirm password is not matched.');

        // password validation using regex.
        if (!validator.password(password)) return res.status(400).send("please enter strong password.");
        
        //bcrypt password 
        // const bycyptpassword = await bcrypt.hash(password, 10);
        const bycyptpassword = await helper.bcryptPassword(password);

        // data save in db
        const registerDataPayload = { ...req.body, password: bycyptpassword };
        // console.log({registerDataPayload , body: req.body});
        const registerdata = new register(registerDataPayload);
        // console.log(registerdata._id.toString());
        const friendData = new friends( {userId : (registerdata._id)});
        await registerdata.save();
        await friendData.save();
        res.status(202).send("user register successfully.");
    } catch (err) {
        console.log(err);
    }
}

module.exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email,password);
        const findUser = await register.findOne({ email });
        // console.log(findUser);
        
        if (!findUser) return res.status(400).send("email is not match or incorrect e mail");

        const isMatch = await helper.comparePassword(password, findUser.password);
        // console.log(isMatch);
        if (!isMatch) return res.status(400).send("password not match");

        const token = helper.jwtToken(findUser._id);
        // console.log(token);

        res.status(200).send({
            msg: "you are successfully login!",
            token
        });
    } catch (err) {

    }
}

module.exports.forgetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        // console.log(email);

        // find user in db
        const useremail = await register.findOne({ email: email });
        // console.log(useremail)

        if (!useremail) {
            return res.status(400).send("user with this email does not exist")
        }

        // check password and confirm password is not matched
        if (!(password === confirmPassword)) return res.status(400).send('password and confirm password is not matched.');

        // password validation using regex.
        if (!validator.password(password)) return res.status(400).send("please enter strong password.");

        // const bycyptpassword = await bcrypt.hash(password, 10);
        const bycyptpassword = await helper.bcryptPassword(password);

        const data = await register.findOneAndUpdate({ email: email },{password : bycyptpassword});

        res.status(201).send("password Change successfully");
    } catch (err) {
        res.status(404).send(err)
    }
}