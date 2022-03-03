let express = require('express')
let app = express()
let mysql = require('mysql')
let port = process.env.PORT || 3656
let path = require('path')
let bodyParser = require('body-parser')
let moment = require('moment')
/////handlebars setup//////
var handlebars = require('handlebars');
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');
var extend = require('handlebars-extend-block');

handlebars = extend(handlebars);
///////////
require('dotenv').config()
app.use(express.static(path.join(__dirname + "/Styles")))
app.use(express.static(path.join(__dirname + "/Scripts")))
app.use(express.static(path.join(__dirname + "/Images")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.set('port', port)

/////auth0 setup//////
const { auth, requiresAuth } = require('express-openid-connect')
app.set('trust proxy', true)

/////cors//////
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) 

///////////
app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        secret: process.env.secret,
        baseURL: process.env. baseURL,
        clientID: process.env.clientID,
        issuerBaseURL: process.env.issuerBaseURL,
        appSession: false,
    })
);

/////routes//////
app.get("/", function (req, res, next){
    user = req.oidc.isAuthenticated() ? req.oidc.user.nickname : false
    let data = {
        userNav: user,
        links: [
            {
                title: 'Home',
                current: true,
                link: "/"
            },
            {
                title: 'About',
                current: false,
                link: "/about"
            },
            {
                title: "Map",
                current: false,
                link: "/map"
            },
            {
                title: "Profile",
                current: false,
                link: "/profile"

            },
            {
                title: "Logout",
                current: false,
                link: "/logout"
            }
        ],
        footerContact: [
            {
                fas: 'fas fa-home me-3',
                value : "1234 Street City, State, Zip"
            
            },
            {
                fas : 'fas fa-envelope me-3',
                value : "birdapp@email.com",
            }
        ],
        footerUsefulLinks: [
            {
                title: 'eBird',
                link : "https://ebird.org/home"
            
            },
            {
                title : 'Institute for Bird Populations',
                link : "https://www.birdpop.org/"
            },
            {
                title: 'National Audubon Society',
                link: 'https://www.audubon.org/'
            }
        ],
        footerHelpLinks: [
            {
                title: "About", 
                link: "/about"
            },
            {
                title: "Help",
                link: "/help"
            }
        ]
    };
    res.render('index', {data: data})
})

app.get("/map", requiresAuth(), function (req, res, next){
    user = req.oidc.isAuthenticated() ? req.oidc.user.nickname : false
    email = req.oidc.isAuthenticated() ? req.oidc.user.email : false

    let data = {
        userNav: user,
        userEmail: email,
        links: [
            {
                title: 'Home',
                current: false,
                link: "/"
            },
            {
                title: 'About',
                current: false,
                link: "/about"
            },
            {
                title: "Map",
                current: true,
                link: "/map"
            },
            {
                title: "Profile",
                current: false,
                link: "/profile"

            },
            {
                title: "Logout",
                current: false,
                link: "/logout"
            }
        ],
        footerContact: [
            {
                fas: 'fas fa-home me-3',
                value : "1234 Street City, State, Zip"
            
            },
            {
                fas : 'fas fa-envelope me-3',
                value : "birdapp@email.com",
            }
        ],
        footerUsefulLinks: [
            {
                title: 'eBird',
                link : "https://ebird.org/home"
            
            },
            {
                title : 'Institute for Bird Populations',
                link : "https://www.birdpop.org/"
            },
            {
                title: 'National Audubon Society',
                link: 'https://www.audubon.org/'
            }
        ],
        footerHelpLinks: [
            {
                title: "About", 
                link: "/about"
            },
            {
                title: "Help",
                link: "/help"
            }
        ]
    };
    res.render('map', {data: data})
}) 

app.get("/profile", requiresAuth(), function (req, res, next){
    userNav = req.oidc.isAuthenticated() ? req.oidc.user.nickname : false
    
    let userMap =  {
        email:   req.oidc.user.email,
        firstName: req.oidc.user.given_name,
        lastName: req.oidc.user.family_name,
        userName: req.oidc.user.nickname,
        profilePic: req.oidc.user.picture
    }

    let loggedBirdsMap = [ 
        {
            species: "Bird 1",
            date: "01/02/22",
            location: "example"
        },
        {
            species: "Bird 2",
            date: "01/03/22",
            location: "example"
        },
        {
            species: "Bird 3",
            date: "01/04/22",
            location: "example"
        },
        {
            species: "Bird 4",
            date:"01/04/22",
            location: "example"
        },    
    ]
    let data = {
        userNav: userNav,
        user: userMap,
        loggedBirds: loggedBirdsMap,
        links: [
            {
                title: 'Home',
                current: false,
                link: "/"
            },
            {
                title: 'About',
                current: false,
                link: "/about"
            },
            {
                title: "Map",
                current: false,
                link: "/map"
            },
            {
                title: "Profile",
                current: true,
                link: "/profile"

            },
            {
                title: "Logout",
                current: false,
                link: "/logout"
            }
        ],
        footerContact: [
            {
                fas: 'fas fa-home me-3',
                value : "1234 Street City, State, Zip"
            
            },
            {
                fas : 'fas fa-envelope me-3',
                value : "birdapp@email.com",
            }
        ],
        footerUsefulLinks: [
            {
                title: 'eBird',
                link : "https://ebird.org/home"
            
            },
            {
                title : 'Institute for Bird Populations',
                link : "https://www.birdpop.org/"
            },
            {
                title: 'National Audubon Society',
                link: 'https://www.audubon.org/'
            }
        ],
        footerHelpLinks: [
            {
                title: "About", 
                link: "/about"
            },
            {
                title: "Help",
                link: "/help"
            }
        ]
    };
    
    res.render('profile', {data: data})
})
    app.get('/test'), function(req, res, next){
        res.render('test')

    }
    app.get('/about', function(req, res, next) {
    user = req.oidc.isAuthenticated() ? req.oidc.user.nickname : false

    let data = {
        userNav: user,
        links: [
            {
                title: 'Home',
                current: false,
                link: "/"
            },
            {
                title: 'About',
                current: true,
                link: "/about"
            },
            {
                title: "Map",
                current: false,
                link: "/map"
            },
            {
                title: "Profile",
                current: false,
                link: "/profile"

            },
            {
                title: "Logout",
                current: false,
                link: "/logout"
            }
        ],
        footerContact: [
            {
                fas: 'fas fa-home me-3',
                value : "1234 Street City, State, Zip"
            
            },
            {
                fas : 'fas fa-envelope me-3',
                value : "birdapp@email.com",
            }
        ],
        footerUsefulLinks: [
            {
                title: 'eBird',
                link : "https://ebird.org/home"
            
            },
            {
                title : 'Institute for Bird Populations',
                link : "https://www.birdpop.org/"
            },
            {
                title: 'National Audubon Society',
                link: 'https://www.audubon.org/'
            }
        ],
        footerHelpLinks: [
            {
                title: "About", 
                link: "/about"
            },
            {
                title: "Help",
                link: "/help"
            }
        ]
    };
    res.render('about', {data:data})
})

app.get('/logout', requiresAuth(), function(req, res, next) {
    user = req.oidc.isAuthenticated() ? req.oidc.user.nickname : false
    let data = {
        userNav: user,
        links: [
            {
                title: 'Home',
                current: false,
                link: "/"
            },
            {
                title: 'About',
                current: false,
                link: "/about"
            },
            {
                title: "Map",
                current: false,
                link: "/map"
            },
            {
                title: "Account info",
                current: true,
                link: "/profile"

            },
            {
                title: "Logout",
                current: false,
                link: "/logout"
            }
        ],
        footerContact: [
            {
                fas: 'fas fa-home me-3',
                value : "1234 Street City, State, Zip"
            
            },
            {
                fas : 'fas fa-envelope me-3',
                value : "birdapp@email.com",
            }
        ],
        footerUsefulLinks: [
            {
                title: 'eBird',
                link : "https://ebird.org/home"
            
            },
            {
                title : 'Institute for Bird Populations',
                link : "https://www.birdpop.org/"
            },
            {
                title: 'National Audubon Society',
                link: 'https://www.audubon.org/'
            }
        ],
        footerHelpLinks: [
            {
                title: "About", 
                link: "/about"
            },
            {
                title: "Help",
                link: "/help"
            }
        ]
    };
axios.get('https://' + baseURL + '/v2/logout?' + 
        'client_id=' + clientID + '&returnTo=' + baseUrl)

        res.render('index', {data:data})
    })

app.get('/help', function (req, res, next) {
    user = req.oidc.isAuthenticated() ? req.oidc.user.nickname : false
    let data = {
        userNav:user,
        accordion: [
            {
                id: 'faq-1_id',
                data_bs_target: 'faq-1_target',
                heading: 'What are these codes?',
                body: '<p>Bird codes, also known as banding codes or alpha codes,'+' are abbreviations for bird names used ' + 
                'by bird banders, ornithologists, and birdwatchers in North and Central America.'+
                ' The codes are written in capital letters, and look like, e.g., MODO for mourning dove.</p>' +
                '<p>The first set contains four-letter codes based on English names while the second set ' + 
                'contains six-letter codes based on the scientific names.</p>' + 
                '<p>Source: <a href= "https://www.birdpop.org/pages/birdSpeciesCodes.php"> Institute for Bird Populations</p>'
            },
            // {
            //     id: 'faq-2_id',
            //     data_bs_target: 'faq-2_target',
            //     heading: 'Question 2',
            //     body: 'This is the answer to the question'
            // },
            // {
            //     id: 'faq-3_id',
            //     data_bs_target: 'faq-3_target',
            //     heading: 'Question 3',
            //     body: 'This is the answer to the question'
            // },
            // {
            //     id: 'faq-4_id',
            //     data_bs_target: 'faq-4_target',
            //     heading: 'Question 4',
            //     body: 'This is the answer to the question'
            // }
        

        ],

        links: [
            {
                title: 'Home',
                current: false,
                link: "/"
            },
            {
                title: 'About',
                current: false,
                link: "/about"
            },
            {
                title: "Map",
                current: false,
                link: "/map"
            },
            {
                title: "Profile",
                current: true,
                link: "/profile"

            },
            {
                title: "Logout",
                current: false,
                link: "/logout"
            }
        ],
        footerContact: [
            {
                fas: 'fas fa-home me-3',
                value : "1234 Street City, State, Zip"
            
            },
            {
                fas : 'fas fa-envelope me-3',
                value : "birdapp@email.com",
            }
        ],
        footerUsefulLinks: [
            {
                title: 'eBird',
                link : "https://ebird.org/home"
            
            },
            {
                title : 'Institute for Bird Populations',
                link : "https://www.birdpop.org/"
            },
            {
                title: 'National Audubon Society',
                link: 'https://www.audubon.org/'
            }
        ],
        footerHelpLinks: [
            {
                title: "About", 
                link: "/about"
            },
            {
                title: "Help",
                link: "/help"
            }
        ]
    };
    
    res.render('help', {data: data})
}
)
/////api//////
var db  = mysql.createPool({
    user: process.env.user,
    password:  process.env.password,
    host:  process.env.host,
    port:  process.env.port,
    database:  process.env.database,
})

app.get('/getbirds', function(req, res, next) {
    db.query('SELECT * FROM birdcodes', function (error, results) {
        if (error){
            throw(error)
        }
        else {
            res.send(JSON.stringify(results))
        }
    });
});

app.post('/getUserID', function (req, res, next) {
    db.query('SELECT * FROM birdUsers WHERE email= ?', [req.body.email], function (error, results){
        if (results.length === 0 ){
            db.query('INSERT INTO birdUsers (email) VALUES (?)', [req.body.email], function( err, results2){
                if (err){
                    throw(err)
                }
            })
        }
        res.send(JSON.stringify(results))
    })
})

app.post('/postBird', function(req, res, next) {
    let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    db.query('SELECT id FROM birdUsers WHERE email= ?', [req.body.email], function (error, results){
        if (error){
            throw(error)
        }  else {
        let id =results[0].id
        db.query('INSERT INTO birdSighting (userID, birdID, coordA, coordB, date) VALUES (?, ?, ?, ?, ?)', [id, req.body.bird,
            req.body.coordA, req.body.coordB, date], function(error, results){
                if (error){
                    throw(error)
                }
                res.send(JSON.stringify(results))
            })

        }
    })
})

app.post('/getlogged', function(req, res, next) {

    db.query('SELECT id FROM birdUsers WHERE email= ?',[req.body.email],  function (error, results){
        if (error){
            throw(error)
        }  else {
            let id =results[0].id
            db.query( 'SELECT birdcodes.englishName, birdSighting.date, birdSighting.birdId, birdSighting.coordA,' +
            'birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes '+
            'INNER JOIN birdSighting on ' +
            'birdcodes.birdID = birdSighting.birdId ' +
            'WHERE birdSighting.userID = ? ' +
            'ORDER BY  birdSighting.date desc '+
            'LIMIT 5', [id], function (error, results) {
                if (error){
                    throw(error)
                }
                res.send(JSON.stringify(results))

            })
        }

    })
})


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})