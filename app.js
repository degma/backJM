const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'xpsm1530',
    database : 'jm'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> {
  res.send(database.usuarios);
})

app.get('/jugadores', (req,res) => {
    db.select('*').from('jugadores').where('activo','=',true)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("Error!"))
})

app.get('/partidos', (req,res) => {
    db.select('id').from('jugadores').where('activo','=',true)
    .then(id => {
        db.select('*').from('partidos').where('id_torneo','=', id)
        .then(data => res.json(data))
        .catch(err => res.status(400).json("Error!"))
    })
    .catch(err => res.status(400).json("Error!"))
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('usuarios')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.put('/desjugador', (req, res) => {
    const { id } = req.body;
    db('jugadores').where('id', '=', id)
    .update('activo',false)
    .returning('activo')
    .then(jugador => {
      res.json(jugador[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
  })

app.post('/jugador', (req, res)=> {
    const { nombre, apellido, apodo, dni, fecha_nac, nrosocio, celular, camiseta, posicion} = req.body;
    db.transaction(trx => {
        trx.insert({
            nombre: nombre,
            apellido: apellido,
            apodo: apodo,
            dni: +dni,
            fecha_nac: fecha_nac,
            nrosocio: nrosocio,
            celular: +celular,
            camiseta: +camiseta,
            posicion: posicion,
            fecha_creacion: new Date(),
            activo: true
        })
        .into('jugadores')
        .returning('dni')
        .then( dni => {
            res.json("Jugador creado OK!")
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    .catch(err => {
        res.status(400).json(`Imposible crear Jugador con DNI:${dni}.`)
        console.log(err)
    })
})

app.post('/register', (req, res) => {
  const { email, nombre, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('usuarios')
          .returning('*')
          .insert({
            email: loginEmail[0],
            nombre: nombre,
            creado: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err))
})


app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})


app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})


app.listen(8080, ()=> {
  console.log('app is running on port 8080');
})