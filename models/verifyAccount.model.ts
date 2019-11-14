import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VerifyAccountSchema = new Schema({
    _id: String,
});

const VerifyAccount = mongoose.model('VerifyAccount', VerifyAccountSchema);

export default VerifyAccount;
