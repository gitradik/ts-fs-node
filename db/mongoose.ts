import * as mongoose from 'mongoose';
import 'dotenv/config'
import '../models';

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.set('debug', true);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    // TODO
});

export default mongoose;

