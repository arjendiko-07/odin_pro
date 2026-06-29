//this is the entry point ,starts the server on port 3000
const app = require('./src/app');
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
});