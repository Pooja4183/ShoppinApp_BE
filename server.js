require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/mongoose');
const PORT = process.env.PORT || 5000;

connectDB();

//start server 

app.listen(PORT,()=>{
    console.log(`Server runnning on http://localhost:${PORT}`);
});


