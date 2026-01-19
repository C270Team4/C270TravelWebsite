const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

//Middleware for JSON parsing
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

//travel list
let travelList = [ 
    {
        id: 1,
        destination: "Shanghai Disneyland",
        country: "China",
        description: "Fun and exciting",
        image: "shanghai-disneyland.jpg"
    },
    {
        id: 2,
        destination: "Suzhou",
        country: "China",
        description: "Ancient old street",
        image: "suzhou.png"
    },
    {
        id: 3,
        destination: "Jeju Island",
        country: "Korea",
        description: "Relaxing",
        image: "jeju-island.jpg"
    }
];



//get home page
app.get('/',(req,res)=>{
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
            <title>Travelling List</title>
        </head>
        <body>
            <!--Navbar-->
            <nav class="navbar navbar-expand-sm py-2" style="background-color: #17183b;" data-bs-theme="dark">
                <div class="container-sm">
                    <a class="navbar-brand" href="/">
                        <img src="images/logo.png" alt="logo" height="auto" width="80px">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ">
                            <li class="nav-item">
                                
                            <a class="nav-link active" aria-current="page" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link" href="/list">List</a>
                            </li>
                                            
                            <li class="nav-item">
                            <a class="nav-link" href="/contact">Contact Us</a>
                            </li>
                            
                        </ul>
                    </div>
                    <div class="navbar  ms-auto">
                        <div class="container-fluid">
                            <form class="d-flex" role="search" method="GET" action="/list">
                            <input class="form-control me-2" type="search" name="q" placeholder="Search" aria-label="Search"/>
                            <button class="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

        <!--carousel slider-->
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="images/jeju-island2.jpg" class="d-block w-100" style="height: 500px; object-fit: cover;" alt="jeju-island2">
                    </div>
                    <div class="carousel-item">
                        <img src="images/melbourne2.png" class="d-block w-100" style="height: 500px; object-fit: cover;" alt="melbourne2">
                    </div>
                    <div class="carousel-item">
                        <img src="images/suzhou2.jpg" class="d-block w-100" style="height: 500px; object-fit: cover;" alt="suzhou2">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

            <div class="text-center my-5">
                <h3>Hi, Explorers!!! ⋆｡ﾟ☁︎｡✈︎⋆｡ ﾟ☾ ﾟ｡⋆</h2>
                <p>I’m Zi Han! Travelling has always been my dream - I love discovering new places, cultures, food and beutiful sights around the world!</p>
                <p><i>Explore the destination I wish to visit one day</i></p>
            </div>

            <div class="text-center my-4">
                <a href="/add" class="btn btn-dark mx-2">Add New Places</a>
                <a href="/list" class="btn btn-dark mx-2">View List</a>
            </div>

            <div class="text-center mt-5">
                <h3>Top Travel Spots</h3>
                <p><i>Favourite places that i must go 💕</i></p>
            </div>

            <section class="py-2 bg-light">
                <div class="container">
                    <div class="row mb-2">
                        <div class="col-md-4 my-3">
                            <div class="card h-100 align-items-center py-5" style="background-color: #FCF7F7;">
                                <img src="images/shanghai-disneyland.jpg" class="card-img-top" alt="shanghai-disneyland" style="width: 300px; height: 200px; object-fit: cover;">
                                <div class="card-body text-start">
                                    <h5 class="card-title">Shanghai Disneyland</h5>
                                    <p class="card-text">
                                        China
                                    </p>
                                    <p>Comments: Fun and Exciting</p>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 my-3">
                            <div class="card h-100 align-items-center py-5" style="background-color: #FCF7F7;">
                                <img src="images/suzhou.png" class="card-img-top" alt="suzhou" style="width: 300px; height: 200px; object-fit: cover;">
                                <div class="card-body text-start">
                                    <h5 class="card-title">Suzhou</h5>
                                    <p class="card-text">China</p>
                                    <p>Comments: Ancient old street</p>

                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 my-3">
                            <div class="card h-100 align-items-center py-5" style="background-color: #FCF7F7;">
                                <img src="images/jeju-island.jpg" class="card-img-top" alt="jeju-island" style="width: 300px; height: 200px; object-fit: cover;">
                                <div class="card-body text-start">
                                    <h5 class="card-title ">Jeju Island</h5>
                                    <p class="card-text">Korea</p>
                                    <p>Comments: Relaxing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer style="background-color: #17183b;" data-bs-theme="dark">
                <div class="container">
                <div class="row pt-4 text-center">
                    <p style="color: white;">&copy;WISH. All Rights Reserved.</p>
                </div>
                </div>
            </footer>

        </body>
        </html>
    `);
})


//get list page
app.get('/list', (req, res) => {
    const search = req.query.q; // get the value of the search input
    let filteredList = [];

    if (search) {
        for (let i = 0; i < travelList.length; i = i + 1) {
            const destinationLower = travelList[i].destination.toLowerCase();
            const countryLower = travelList[i].country.toLowerCase();
            const searchLower = search.toLowerCase();

            if (
                destinationLower.includes(searchLower) ||
                countryLower.includes(searchLower)
            ) {
                filteredList.push(travelList[i]);
            }
        }
        if (filteredList.length === 0) {
            res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 Not Found</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
                </head>
                <body class="text-center mt-5">
                    <h1 style="font-size: 80px;">404</h1>
                    <p style="font-size: 24px;">No destinations found for "<strong>${search}</strong>"</p>
                    <a href="/list" class="btn btn-dark mt-3">Back to Travel List</a>
                </body>
                </html>
            `);
            return; 
        }
    } else {
        filteredList = travelList; // no search, show everything
    }
    
    let travelCards = "";
    for (let i = 0; i < filteredList.length; i = i + 1) {
        travelCards += `
            <div class="col-md-4 mb-3">
                <div class="card h-100 align-items-center py-5" style="background-color: #FCF7F7;">
                    <img src="images/${filteredList[i].image}" class="card-img-top" alt="${filteredList[i].destination}" style="width: 300px; height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${filteredList[i].destination}</h5>
                        <p class="card-text">${filteredList[i].country}</p>
                        <p>Comments: ${filteredList[i].description}</p>
                        <form action='/editTravel/${filteredList[i].id}' method='GET' style="display: inline-block; margin-right: 10px;">
                            <button type='submit'>Edit</button>
                        </form>
                        <form action='/deleteTravel/${filteredList[i].id}' method='POST' style="display: inline-block;"  onsubmit="return confirm('Confirm Deletion?')">
                            <button type='submit'>Delete</button>
                        </form>
                        
                        
                    </div>
                </div>
            </div>
        `;
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        </head>
        <body>
            <nav class="navbar navbar-expand-sm py-2" style="background-color: #17183b;" data-bs-theme="dark">
                <div class="container-sm">
                    <a class="navbar-brand" href="/">
                        <img src="images/logo.png" alt="logo" height="auto" width="80px">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ">
                            <li class="nav-item">
                                
                            <a class="nav-link" aria-current="page" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                            <a class="nav-link active" href="/list">List</a>
                            </li>
                                            
                            <li class="nav-item">
                            <a class="nav-link" href="/contact">Contact Us</a>
                            </li>
                            
                        </ul>
                    </div>
                    <div class="navbar  ms-auto">
                        <div class="container-fluid">
                            <form class="d-flex" role="search" method="GET" action="/list">
                            <input class="form-control me-2" type="search" name="q" placeholder="Search" aria-label="Search"/>
                            <button class="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <div style="
                background-image: url('images/travel-background.jpg');
                background-size: cover;
                background-position:center;
                padding: 40px 0;
            ">
                <div class="text-center mt-5">
                    <h2>Travel List ✈</h2>
                </div>
                <div class="container my-5">
                    <div class="row">
                        ${travelCards}
                    </div>
                </div>
            </div>

            <footer style="background-color: #17183b;" data-bs-theme="dark">
                <div class="container">
                <div class="row pt-4 text-center">
                    <p style="color: white;">&copy;WISH. All Rights Reserved.</p>
                </div>
                </div>
            </footer>
        </body>
        </html>
    `);
});


//add place
app.get('/add', (req, res) => {
    res.send(`
        <div style="max-width: 500px; margin: 50px auto; font-family: Arial, sans-serif;">
            <h2 style="text-align: center;">Add a New Place</h2>
            <form action="/add" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label>Destination:</label><br>
                    <input type="text" name="destination" style="width: 100%; padding: 8px;" required>
                </div>
                <div>
                    <label>Country:</label><br>
                    <input type="text" name="country" style="width: 100%; padding: 8px;" required>
                </div>
                <div>
                    <label>Description:</label><br>
                    <input type="text" name="description" style="width: 100%; padding: 8px;" required>
                </div>
                <div>
                    <label>Image Filename:</label><br>
                    <input type="text" name="image" style="width: 100%; padding: 8px;">
                </div>
                <button type="submit" style="padding: 10px; background-color: #000000; color: white; border: none; cursor: pointer;">
                    Add Place
                </button>
                <div style="text-align: center;">
                    <a href="/" style="display: inline-block; margin-top: 10px;">Back to Home</a>
                </div>
                
            </form>
        </div>
    `);
});

app.get('/contact', (req, res) => {
    res.send(`
        <div style="max-width: 500px; margin: 50px auto; font-family: Arial, sans-serif;">
            <h2 style="text-align: center;">Contact Me</h2>
            <form action="/contact" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label>Name:</label><br>
                    <input type="text" name="name" style="width: 100%; padding: 8px;">
                </div>
                <div>
                    <label>Phone Number:</label><br>
                    <input type="number" name="phone" style="width: 100%; padding: 8px;">
                </div>
                <div>
                    <label>Email:</label><br>
                    <input type="email" name="email" style="width: 100%; padding: 8px;">
                </div>
                <div>
                    <label>Comments:</label><br>
                    <input type="text" name="comment" style="width: 100%; padding: 8px;">
                </div>
                <button type="submit" style="padding: 10px; background-color: #000000; color: white; border: none; cursor: pointer;">
                    Submit
                </button>
                <div style="text-align: center;">
                    <a href="/" style="display: inline-block; margin-top: 10px;">Back to Home</a>
                </div>
                
            </form>
        </div>
    `);
});

app.get('/editTravel/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let travel = null;

    for (let i =0; i<travelList.length; i++) {
        if(travelList[i].id === id) {
            travel = travelList[i];
            break;
        }
    }

    if(!travel){
        return res.send('<p>Place not found.</p><a href = "/list">Back to List</a>');
    }
    res.send(`
        <div style="max-width: 500px; margin: 50px auto; font-family: Arial, sans-serif;">
            <h2 style="text-align: center;">Edit Comic</h2>
            <form action="/editTravel/${travel.id}" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label>Destination:</label><br>
                    <input type="text" name="destination" value="${travel.destination}" style="width: 100%; padding: 8px;" required>
                </div>
                <div>
                    <label>Country:</label><br>
                    <input type="text" name="country" value="${travel.country}" style="width: 100%; padding: 8px;" required>
                </div>
                <div>
                    <label>Description:</label><br>
                    <input type="text" name="description" value="${travel.description}" style="width: 100%; padding: 8px;" required>
                </div>
                <button type="submit" style="padding: 10px; background-color: #000000; color: white; border: none; cursor: pointer;">
                    Update Comic
                </button>
                <div style="text-align: center;">
                    <a href="/list" style="display: inline-block; margin-top: 10px;">Back to List</a>
                </div>
            </form>
        </div>
    `);

})


app.use(express.urlencoded({extended: true}));




app.post('/add', (req, res) => {
    const newTravel = {
        id:Date.now(),
        destination: req.body.destination,
        country: req.body.country,
        description: req.body.description,
        image: req.body.image
    };
    travelList.push(newTravel); // Add new place to the list
    res.redirect('/list'); // Go to list page
});

app.post('/contact', (req, res) => {
    res.redirect('/');
});


app.post('/editTravel/:id', (req, res) => {
  const id = parseInt(req.params.id);

  for (let i = 0; i < travelList.length; i++) {
    if (travelList[i].id === id) {
      travelList[i].destination = req.body.destination;
      travelList[i].country = req.body.country;
      travelList[i].description = req.body.description;
      break;
    }
  }
  res.redirect('/list');
});

app.post('/deleteTravel/:id', (req, res) => {
    const id = parseInt(req.params.id);
    travelList = travelList.filter(b => b.id !==id);
    res.redirect('/list');
});


 
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

module.exports = app;