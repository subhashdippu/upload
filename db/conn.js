const mongoose = require("mongoose")
const db = process.env.DATABASE;
const connectP = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(db, connectP).then(() => {
    console.log("Connection Successful");
}).catch((e) => {
    console.log('No Connecction');
});
