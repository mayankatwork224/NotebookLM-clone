// This is a singleton class.  means a class can have only one instance of it
// singleton design pattern

import {
  generateTokens,
  signAccessToken,
  signRefereshToken,
} from "src/app/helpers/jwt";
import { User } from "src/app/models/userSchema";
import { GoogleUserType } from "src/types/user_types";

export class UserRepository {
  private static instance: UserRepository;

  // static method of the class
  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async createUser(
    userProps: GoogleUserType,
    token: { accessToken: string; refreshToken: string },
  ) {
    // name : {type:String, required: false},
    // email : {type:String, required: true, unique: true},
    // image : {type:String, required: false},
    // googleAccessToken : {type:String, required: false},
    // googleRefreshToken : {type:String, required: false},
    // googleId : {type:String, required: false},

    // _json: {
    //     sub: '102343583523670203993',
    //     name: 'Mayank Kapadane',
    //     given_name: 'Mayank',
    //     family_name: 'Kapadane',
    //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocJuW7cFdHDm2hHzp2_isqcvUvk8T8FAC7JBaydGz2tjuKpNIA=s96-c',
    //     email: 'kapadanemayank007@gmail.com',
    //     email_verified: true
    // }

    const { sub: id, name, picture, email } = userProps?._json;

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      const user = new User({
        name: name,
        email: email,
        image: picture,
        googleAccessToken: token?.accessToken,
        googleRefreshToken: token?.refreshToken,
        googleId: id,
      });

      const newUser = await user.save();

      const { accessToken, refreshToken } = await generateTokens(newUser?._id);

      // return newUser
      return {
        authData: {
          ...newUser.toObject(),
          token: { accessToken, refreshToken },
        },
      };
    } else {
      const { accessToken, refreshToken } = await generateTokens(
        existingUser?._id,
      );

      // return newUser
      return {
        authData: {
          ...existingUser.toObject(),
          token: { accessToken, refreshToken },
        },
      };
    }
  }
}
