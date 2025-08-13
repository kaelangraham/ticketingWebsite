const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'pass',
    database: 'ticketsdb',
    multipleStatements: true
})

app.get('/', (req, res) => {
    return res.json("From Backend Server")
})

app.get('/theatres', (req, res) => {
    const sql = "SELECT * FROM theatres"
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/genres', (req, res) => {
    const searchTerm = req.query.search
    const sql = `SELECT g.id, g.genre
                 FROM genres g
                 WHERE g.genre LIKE '%${searchTerm}%'`
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/movies', (req, res) => {
    const sortType = req.query.sortType
    const movieId = req.query.movieId
    const sqlMovies =  `SELECT m.id, m.name, m.description, theatres.theatreName, theatres.location, m.availableTickets, m.totalTickets, m.showingTime, m.showingDate, m.runtime, m.releaseDate, m.coverImg, m.ticketAdult, m.ticketChild, m.ticketStudent, m.ticketSenior
                        FROM movies m
                        JOIN theatres ON theatreId = theatres.id
                        ${movieId ? `WHERE m.id = ${movieId}` : ''}
                        ${sortType ? `ORDER BY ${sortType} ASC` : ''};`
    db.query(sqlMovies, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/tickets', (req, res) => {
    const movieId = req.query.movieId 
    const sql = `SELECT *
                 FROM tickets
                 WHERE movieId = ${movieId};`
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.post('/order', (req, res) => {
    const { movieId, availableTickets, buyerEmail, tickets } = req.body

    let sqlAddTickets = ''
    tickets.map(d => {
        sqlAddTickets = sqlAddTickets + `INSERT INTO tickets 
                                         (movieId, ticketId, buyerEmail, ticketType) 
                                         VALUES ('${movieId}', '${d.ticketId}', '${buyerEmail}', '${d.ticketType}'); `
    })
    const sqlUpdateMovies = `UPDATE movies SET availableTickets=${availableTickets}
                             WHERE id =${movieId};`
    const sql = sqlAddTickets + sqlUpdateMovies

    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})


app.listen(8081, () => {
    console.log("listening")
})