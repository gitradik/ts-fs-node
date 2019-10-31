import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
    _id: String,
    used: {
        type: Boolean,
        required: true,
        default: false
    }
});

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
