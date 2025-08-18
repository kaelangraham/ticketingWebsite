const mysql = require('mysql')
const fs = require('fs')
const csv = require('csv-parser')

// db connection
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'pass',
    database: 'ticketsdb',
    multipleStatements: true
})

// list initialisation
const checkedGenres = []
const checkedGenresNames = []
const addingGenres = []
const theatres = []

// database initial fetch
db.query("SELECT * FROM genres; SELECT * FROM theatres; SELECT * FROM movies ORDER BY id DESC LIMIT 1", (err, data) => {
    if(err) return err
    if(data[1].length == 0) return
    let latestMovieId = 0
    if(data[2].length != 0) latestMovieId = data[2].id
    
    // adds current genres to list of genres so no repeats
    data[0].map((d) => {
        checkedGenres.push([d.id, d.genre])
        checkedGenresNames.push(d.genre)
    })
    // adds theatres from db to list
    data[1].map((d) => {
        theatres.push([d.id, d.capacity])
    })

    // maps through web scraped csv file
    fs.createReadStream('movies.csv')
        .pipe(csv())
        .on('data', (row) => {

            // sets csv file to 
            let genres = row.genre ? row.genre.slice(1, -1).split(',') : []
            const id = latestMovieId + 1
            latestMovieId = latestMovieId + 1
            const name = row.name
            const description = row.description
            const runtime = row.runtime
            const coverImg = row.coverImg
            const releaseDate = row.releaseDate
            const theatreId = Math.floor(Math.random() * (theatres.length) + 1)
            const availableTickets = theatres[theatreId - 1][1]
            const totalTickets = theatres[theatreId - 1][1]
            // ticket cost calculator
            const ticketBasePrice = 15
            const runtimePrice = runtime[0] * 2
            const capacityPrice = 200/totalTickets

            const ticketAdult = (ticketBasePrice + runtimePrice + capacityPrice).toFixed(2)
            const ticketChild = (ticketBasePrice + runtimePrice + capacityPrice - 4).toFixed(2)
            const ticketStudent = (ticketBasePrice + runtimePrice + capacityPrice - 1).toFixed(2)
            const ticketSenior = (ticketBasePrice + runtimePrice + capacityPrice - 4).toFixed(2)

            // opening and closing hour for showing time
            const openingHour = 9
            const closingHour = 23

            const showingTimeHour = String(Math.floor(Math.random() * (closingHour - openingHour + 1)) + openingHour).padStart(2, '0')
            const showingTimeMinute = String(Math.floor(Math.random() * 4) * 15).padStart(2, '0')

            const showingTime = `${showingTimeHour}:${showingTimeMinute}:00`

            // sets showing date
            const showingDateRange = 14
            const today = new Date()
            const showingDateTemp = new Date(today)
            showingDateTemp.setDate(today.getDate() + Math.floor(Math.random() * (showingDateRange + 1)))
            const showingDate = showingDateTemp.toISOString().slice(0,10)
            // insert sql
            const moviesInsertSql = "INSERT INTO movies (name, description, theatreId, availableTickets, totalTickets, ticketAdult, showingTime, showingDate, runtime, coverImg, releaseDate, ticketChild, ticketStudent, ticketSenior) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            // ADD TO MOVIES
            db.query(moviesInsertSql, [name, description, theatreId, availableTickets, totalTickets, ticketAdult, showingTime, showingDate, runtime, coverImg, releaseDate, ticketChild, ticketStudent, ticketSenior], (err) => {
                if(err) return err
            })

            // compares new genres to existing genres
            genres.map((g) => {
                let genre = JSON.parse(g).genre
                if(!checkedGenresNames.includes(genre)) {
                    if(checkedGenres[0]) {previousId = checkedGenres[checkedGenres.length - 1][0]} else {previousId = 0}
                    checkedGenresNames.push(genre)
                    checkedGenres.push([previousId + 1, genre])
                    addingGenres.push([previousId + 1, genre])
                }
                const genreId = checkedGenres[checkedGenresNames.indexOf(genre)][0]
                // insert sql
                const genrerefInsertSql = "INSERT INTO genreref(movieId, genreId) VALUES (?,?)"
                // ADD TO GENREREF
                db.query(genrerefInsertSql, [id, genreId], (err) => {
                    if(err) return err
                })
            })
        })
        .on('end', () => {
            console.log('end')
            // insert sql
            const genresInsertSql = "INSERT INTO genres (id, genre) VALUES (?, ?)"
            // ADD TO GENRES
            addingGenres.map(d => {
                db.query(genresInsertSql, [d[0], d[1]], (err) => {
                    if(err) return err
                })
            })
        })
})