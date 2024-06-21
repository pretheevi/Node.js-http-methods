// import express package 
const express = require('express');
const fs = require('fs');
let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));
app.use(express.json());

//ROUTE HANDLER FUNCTIONS
const getAllMovies = (req, res) => {
    res.status(200).json({
        status:"success",
        "count":movies.length,
        data:{
            movies:movies
            }});
}
const getMovies = (req,res)=>{
    const ID= req.params.id*1;
    const SpecificMovie = movies.find(el => el.id==ID);
    if(!SpecificMovie){
        return res.status(404).json({
            status:"fail",
            message:"Movies with ID "+ID+" not found"
        });
    }
    res.status(200).json({
        status:"success",
        data:{
            movie: SpecificMovie
            }});
}

const createMovie =(req, res) =>{
    //console.log(req.body);
    const newIdAdd = Number(movies[movies.length - 1].id);
    const newID = newIdAdd + 1;

    const newMovie = Object.assign({id: newID}, req.body);

    movies.push(newMovie);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
        res.status(201).json({
            status:'success',
            data:{
                movies:newMovie
            }
        })
    });
}

const updateMovie = (req, res)=>{
    const ID = req.params.id*1;
    let moviesUpdate = movies.find(el => el.id === ID);
    let index = movies.indexOf(moviesUpdate);// e.g. - id = 4, index = 3

    if(!moviesUpdate){
        return res.status(404).json({
            status:"fail",
            message:"No movies Object with ID:"+ ID + " found"
        })
    };

    Object.assign(moviesUpdate, req.body);
    movies[index] = moviesUpdate;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
        res.status(200).json({
            status:'success',
            count: movies.length,
            data:{
                movies:moviesUpdate
            }
        })
    });
    //console.log(moviesUpdate)
}

const deleteMovie = (req, res) => {
    const ID = req.params.id*1;
    const x = ID - 1;
    const index = movies[x];

        if (!index) {
            return res.status(404).json({
                status: 'fail',
                message: 'Movie not found'
            });
        }
        delete movies[x];

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
        if(err){
            return res.status(500).json({
                status: 'error',
                message: 'Error writing to file'
            });
        }
        res.status(204).json({
            status:'success',
            count: movies.length,
            data:{
                movies:null
            }
        })
    });
    }

//GET - api/movies
// app.get('/api/v1/movies', getAllMovies);
// app.get('/api/v1/movies/:id',getMovies)
// app.post('/api/v1/movies',createMovie);
// app.patch('/api/v1/movies/:id', updateMovie);
// app.delete('/api/v1/movies/:id', deleteMovie);

app.route('/api/v1/movies')
    .get(getAllMovies)
    .post(createMovie)

app.route('/api/v1/movies/:id')
    .get(getMovies)
    .patch(updateMovie)
    .delete(deleteMovie)


//create a server
const port = 3000;

app.listen(port, () =>{
    console.log('server has started');
})