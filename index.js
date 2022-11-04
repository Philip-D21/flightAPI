const http = require('http');
const fs = require('fs');
const path = require('path');

const flightDbPath = path.join(__dirname, "db", 'flight.json');

const PORT = 4000
const HOST_NAME = 'localhost';


function requestHandler(req, res) {

    if (req.url === '/flight/:id' && req.method === "GET") { 
        getAllFlight(req, res)
    } else if (req.url === '/flights' && req.method === "POST") {
        addFlight(req, res)
    } else if (req.url === '/flight/:id' && req.method === "PUT") {
        updateFlight(req, res)
    } else if (req.url === '/flight/:id' && req.method === "DELETE") {
        deleteFlight(req, res)
    }
}




function getAllFlight (req, res) {
    fs.readFile(flightDbPath, "utf8", (err, data) => {
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        res.end(data)
    })
}

 function addFlight(req, res) {
     const body = []

     req.on("data", (chunk) => {
         body.push(chunk)
     })

    req.on("end", () => {
      const parsedFlight = Buffer.concat(body).toString()
       const newFlight = JSON.parse(parsedFlight)         
         fs.readFile(flightDbPath, "utf8", (err, data) => {
             if (err) {
                 console.log(err)
                 res.writeHead(400);
                 res.end("An error occured");
             }
            })
             const oldFlight = JSON.parse(data)            
             const allFlight = [...oldFlight, newFlight]

             fs.writeFile(flightDbPath, JSON.stringify(allFlight), (err) => {
                 if (err) {
                     console.log(err);
                     res.writeHead(500);
                    res.end(JSON.stringify({
                         message: 'Internal Server Error. Could not save flight to database.'
                    }));
                 }

                 res.end(JSON.stringify(newFlight));             
                });
        })
  }
 


 function updateFlight(req, res) {
     const body = []

     req.on("data", (chunk) => {
         body.push(chunk)
             })
     req.on("end", () => {
         const parsedFlight = Buffer.concat(body).toString()
         const detailsToUpdate = JSON.parse(parsedFlight)         
         const flightId = detailsToUpdate.id

        fs.readFile(flightDbPath, "utf8", (err, flight) => {
             if (err) {
                               console.log(err)
                 res.writeHead(400)                 
                 res.end("An error occured")           
             }

            const flightObj = JSON.parse(flights)
            const flightIndex = flightObj.findIndex(flight => flight.id === flightId)

            if (flightIndex === -1) {
                res.writeHead(404)
                res.end("Flight with the specified id not found!")
                return
            }

            const updateFlight = { ...flightObj[flightIndex], ...detailsToUpdate }
            flightObj[flightIndex] = updatedFlight

            fs.writeFile(flightDbPath, JSON.stringify(flightObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save flight to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Update successfull!");
            });

        })

    })
}


 function deleteFlight(req, res) {
    const body = []

    req.on("data", (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedFlight = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedFlight)
        const flightId = detailsToUpdate.id

        fs.readFile(flightDbPath, "utf8", (err, flight) => {
            if (err) {
                console.log(err)
                res.writeHead(400)
                res.end("An error occured")
            }

            const flightObj = JSON.parse(flight)

            const flightIndex = flightObj.findIndex(flight => flight.id === flightId)

            if (flightIndex === -1) {
                res.writeHead(404)
                res.end("Book with the specified id not found!")
                return
            }

            // DELETE FUNCTION
            flightObj.splice(flightIndex, 1)

            fs.writeFile(flightDbPath, JSON.stringify(flightObj), (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: 'Internal Server Error. Could not save flight to database.'
                    }));
                }

                res.writeHead(200)
                res.end("Deletion successfull!");
            });

        })

    })
}










const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
    flightDB = JSON.parse(fs.readFileSync(flightDbPath, 'utf8'));
    console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
})