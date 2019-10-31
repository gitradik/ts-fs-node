import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    photoPath: {
        type: String,
        required: true
    },
    description: String,
});

export default PhotoSchema;
