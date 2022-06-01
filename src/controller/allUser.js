const allUser = require('./../model/user');
const friends = require('./../model/friends');

// all user show for send request  ....
module.exports.allUserShow = async (req, res) => {
    try {
        //login user Details....
        const userDetail = req.userDetail;

        //show all user details except login user .....
        const showData = await allUser.find({ _id: { $nin: userDetail.id } });

        const data = []
        showData.forEach(element => {
            allData = { id: element.id, name: element.firstName + " " + element.lastName, email: element.email };
            data.push(allData);
        });
        res.status(200).send({
            msg: "find friends ",
            data
        })
    } catch (err) {
        console.log(err);
    }
};

// show all friends of a user ...
module.exports.allFriends = async (req, res) => {
    try {
        //login user Details....
        const userDetail = req.userDetail;

        // find friends in the friends schema ...
        const allFriendsFind = await friends.findOne({ userId: userDetail._id }).populate("friends.friendsId");

        // show all friends ...
        const allFriends = [];
        allFriendsFind.friends.forEach((e) => {
            if (e.request == true) {
                const { id, firstName, lastName, email, mobile } = e.friendsId;
                const data = { id, firstName, lastName, email, mobile, request: e.request };
                allFriends.push(data);
            }
        })
        res.status(200).send(allFriends);
    } catch (err) {
        console.log(err);
    }
}

// show all friend request  of a user ...
module.exports.allRequest = async (req, res) => {
    try {
        //login user Details....
        const userDetail = req.userDetail;

        // find friends in the friends schema ...
        const allFriendsFind = await friends.findOne({ userId: userDetail._id }).populate("friends.friendsId");

        // show all friends ...
        const allFriends = [];
        allFriendsFind.friends.forEach((e) => {
            if (e.request == false) {
                const { id, firstName, lastName, email, mobile } = e.friendsId;
                const data = { id, firstName, lastName, email, mobile, request: e.request };
                allFriends.push(data);
            }
        })
        res.status(200).send(allFriends);
    } catch (err) {
        console.log(err);
    }
}

module.exports.sendRequest = async (req, res) => {
    try {
        //login user Details....
        const userDetail = req.userDetail;
        const id = req.params.id;

        // find user before send request ...
        const user = await allUser.findOne({ _id: id });

        // if user not found ....
        if (user == null) return res.status(400).send('User not found ');

        // user cannot send friend request to yourself
        if (userDetail._id == id) return res.status(400).send('user cannot send friend request to yourself.');

        // find user in friend schema ...
        const checkRequest = await friends.findOne({ userId: userDetail._id });

        //check friend request is already send or not.....
        const newId = [];
        checkRequest.friends.forEach((e) => {
            const checkId = e.friendsId.toString();
            if (checkId == id) {
                newId.push(checkId);
            }
        })

        // if friend request is already send .... 
        if (newId.length == 1) return res.status(400).send("you have already send friend request");

        // user can send friend request... 
        const sendRequest = await friends.findOne({ userId: userDetail._id });
        let data = {
            friendsId: id,
            request: true,
        }
        sendRequest.friends.push(data);
        await sendRequest.save();

        // receiver receive friend request ...
        const receiver = await friends.findOne({ userId: id });
        let data1 = {
            friendsId: userDetail.id,
            request: false,
        }
        receiver.friends.push(data1);
        await receiver.save();

        res.status(200).send("friend request send successfully .")
    } catch (err) {
        console.log(err);
    }
}

module.exports.acceptRequest = async (req, res) => {
    try {
        //login user Details....
        const userDetail = req.userDetail;
        const id = req.params.id;
        // find friends to accept the request ....
        const acceptRequest = await friends.findOne({ userId: userDetail._id });

        // user cannot accept friend request to yourself
        if (userDetail._id == id) return res.status(400).send('user cannot accept friend request to yourself.');

        const data = []
        acceptRequest.friends.forEach(async (e) => {
            const checkId = e.friendsId.toString();
            if (checkId == id) {
                if (e.request == true) {
                    data.push(e.request);
                }
                e.request = true;
            }
        });
        if (data.length >= 1) return res.status(400).send(" you have already accept the friend request .now you both are friends.")
        acceptRequest.save();
        res.status(200).send("request accept successfully")

    } catch (err) {
        console.log(err);
    }
}


module.exports.unfriend = async (req, res) => {
    try {
        //login user Details....
        const userDetail = req.userDetail;
        const id = req.params.id;

        // check login user in friend schema 
        const unfriend = await friends.findOne({ userId: userDetail._id });
        
        // user cannot un friend to yourself
        if (userDetail._id == id) return res.status(400).send('user cannot un friend to yourself.');
        
        // find friend who want to unfriend in login user document.
        const request = [];
        unfriend.friends = unfriend.friends.filter((e) => {
            if (e.friendsId == id && e.request ==  false) {
                request.push(e);
            }
            let data = e.friendsId != id 
            return data;
        })

        // check you unfriend or not ....
        if(request.length >= 1 ) return res.status(400).send("you can not unfriend this. because you both are not friend.");

        // check user who wannt to unfriend it in in friend schema .
        const unfriend1 = await friends.findOne({ userId: id });
        
        // unfriend login user in other user schema
        const request1 = []
        unfriend1.friends = unfriend1.friends.filter((e) => {
            if (e.friendsId == userDetail.id && e.request ==  false) {
                request1.push(e);
            }
            let data = e.friendsId.toString() != userDetail._id.toString();
            return data;
        })
        // check you unfriend or not ....
        if(request1.length >= 1 ) return res.status(400).send("you can not unfriend this. because you both are not friend.")
        
        await unfriend.save();
        await unfriend1.save();
        res.status(200).send("you are not don 't know each other ");

    } catch (err) {
        console.log(err);
    }
}




