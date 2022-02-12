let express = require('express')
let app = express()
let mysql = require('mysql')
let port = process.env.PORT || 3656
let path = require('path')
let bodyParser = require('body-parser')
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
app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        secret: process.env.secret,
        baseURL: process.env. baseURL,
        clientID: process.env.clientID,
        issuerBaseURL: process.env.issuerBaseURL
    })
);



/////routes//////
app.get("/", function (req, res, next){
    let data = {
        links: [
            {
                title: 'home',
                current: true,
                link: "/"
            },
            {
                title: 'about',
                current: false,
                link: "/about"
            },
            {
                title: "map",
                current: false,
                link: "/map"
            },
            {
                title: "account info",
                current: false,
                link: "/profile"

            },
            {
                title: "logout",
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
    let data = {
        links: [
            {
                title: 'home',
                current: false,
                link: "/"
            },
            {
                title: 'about',
                current: false,
                link: "/about"
            },
            {
                title: "map",
                current: true,
                link: "/map"
            },
            {
                title: "account info",
                current: false,
                link: "/profile"

            },
            {
                title: "logout",
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
        user: userMap,
        loggedBirds: loggedBirdsMap,
        links: [
            {
                title: 'home',
                current: false,
                link: "/"
            },
            {
                title: 'about',
                current: false,
                link: "/about"
            },
            {
                title: "map",
                current: false,
                link: "/map"
            },
            {
                title: "account info",
                current: true,
                link: "/profile"

            },
            {
                title: "logout",
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

app.get('/about', function(req, res, next) {

    let data = {
        links: [
            {
                title: 'home',
                current: false,
                link: "/"
            },
            {
                title: 'about',
                current: false,
                link: "/about"
            },
            {
                title: "map",
                current: false,
                link: "/map"
            },
            {
                title: "account info",
                current: true,
                link: "/profile"

            },
            {
                title: "logout",
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
    let data = {
        links: [
            {
                title: 'home',
                current: false,
                link: "/"
            },
            {
                title: 'about',
                current: false,
                link: "/about"
            },
            {
                title: "map",
                current: false,
                link: "/map"
            },
            {
                title: "account info",
                current: true,
                link: "/profile"

            },
            {
                title: "logout",
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

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})