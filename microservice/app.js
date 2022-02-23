let express = require('express')
let app = express()
let port = process.env.PORT || 3656
let path = require('path')
let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.set('port', port)
app.use(express.static(__dirname))
var cors = require('cors')
app.use(cors())

app.route('/')
    .post(function(req, res, next){
        let trackCount = 0
        let playListLength = 0 
        let artistCount = 0
        let artistList = []
        let albumCount = 0
        let albumList = []
        let data = req.body['data']
        for (const property in data) {
            trackCount = trackCount + 1 
            playListLength = playListLength + parseFloat(data[property].length)
            if (!artistList.includes(data[property].artist)){
                artistList.push(data[property].artist)
                artistCount = artistCount + 1 
            }
            if (!albumList.includes(data[property].album)){
                albumList.push(data[property].album)
                albumCount = albumCount + 1 
            }
        }
        let response = {
            'trackCount': trackCount,
            'playListLength': playListLength,
            'artistCount': artistCount,
            'albumCount': albumCount
        }
        res.send(JSON.stringify(response))
    })

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})