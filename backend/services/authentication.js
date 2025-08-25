import JWT from 'jsonwebtoken';
import { randomBytes, createHmac } from "crypto";
import { profile } from 'console';

const secret = "HardCoded";

function createTokensForUsers ( user ){
    const payloads = {
        _id : user._id,
        email: user.email,
        profileImageURL : user.profileImageURL,

    }

    const token = JWT.sign(payloads,secret,{ expiresIn: '1d' });

    return token;
}

export  {createTokensForUsers,secret};