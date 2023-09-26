const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            Area: {
                type: String,

            },
            // email: {
            //     type: String,
            //     required: true
            // },
            phone: {
                type: Number,

            },
            flat: {
                type: String,
            },
            LandMark: {
                type: String,
            },
            Town: {
                type: String,
            },
            State: {
                type: String,
            }
        }
    ],
    tokens: [// Here use array because you will log in multiple time and the token will generate every time
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})


userSchema.pre('save', async function (next) { //Here we use next for middleware
    console.log("This bcrypt")
    if (this.isModified('password')) {// when the password is change then run this or hash
        this.password = await bcrypt.hash(this.password, 12); //This is the method of hashing password
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})
userSchema.methods.generateAuthToken = async function () {// Here userSchema ke ander methods hai aur method ke ander generateAuthtoken hai we should use try with fuction
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY); // It will generate the token run for the email 
        this.tokens = this.tokens.concat({ token: token });// this is use for reffering the object, concat is use for concatinate the token for token in schema. Here first token is from schema and second token is generated token 
        await this.save(); //It will save the data in database
        return token;
    } catch (err) {
        console.log(err);
    }
}
userSchema.methods.addMessage = async function (name, phone, Area, flat, LandMark, Town, State) {
    try {
        this.messages = this.messages.concat({ name, phone, Area, flat, LandMark, Town, State })
        await this.save()
        return this.messages
    } catch (error) {
        console.log(error)
    }
}
const User = mongoose.model('USER', userSchema)

module.exports = User; // we can call from other place 