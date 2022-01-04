var express = require('express')
var cors = require('cors')  
var app = express();
app.use(cors());
const port = process.env.port || 3000


app.get('/', (req, res, next) => {
    res.send("hello from express")
})

app.listen(port, ()=>{
    console.log(`app listening on port ${port}`);
})