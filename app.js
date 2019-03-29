const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'xpsm1530',
        database: 'jm'
    }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(database.usuarios);
})

app.get('/jugadores', (req, res) => {
    db.select('*').from('Jugadores').where('activo', '=', true)
        .then(data => res.json(data))
        .catch(err => res.status(400).json("Error!"))
})

app.get('/cobrosfecha/:idpartido', (req, res) => {

    const { idpartido } = req.params;

    db.raw(`
    SELECT "J1".id ,"J1".nombre,"J1".apellido,"J1".apodo, 
    (SELECT SUM(importe) FROM "Movimientos" WHERE id_partido = ${idpartido} and id_operacion= 1 and id_jugador = "J1".id) as "Pago",
    (SELECT SUM(importe) FROM "Movimientos" WHERE id_partido = ${idpartido} and id_operacion=2 and id_jugador = "J1".id) as "Debe"
    FROM "Jugadores" as "J1"
    WHERE "J1".activo = true
    `)
        .then(data => {
            console.log(data)
            res.json(data.rows)
        })
        .catch(err => res.status(400).json(err))

        .catch(err => res.status(400).json(err))
})

app.get('/partidos', (req, res) => {
    db.select().from('Torneos').where('activo', '=', true).first()
        .then(data => {
            console.log(data.id)
            db.raw(`select "Partidos".id "id_partido", "Partidos".nro, TO_CHAR("Partidos".fecha_partido :: DATE, 'dd/mm/yyyy') "fecha", "Equipos".nombre, sum("Movimientos".importe) "recaudacion" from "Partidos"
                LEFT JOIN "Movimientos" ON  "Movimientos".id_partido = "Partidos".id and "Movimientos".id_operacion = 1
                INNER JOIN "Equipos" ON "Equipos".id = "Partidos".id_equipo
                WHERE id_torneo = ${data.id}
                group by "Partidos".id, "Partidos".nro, "Partidos".fecha_partido, "Equipos".nombre`)
                .then(data => {
                    console.log(data)
                    res.json(data.rows)
                })
                .catch(err => res.status(400).json(err))
        })
        .catch(err => res.status(400).json(err))
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('Login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('Usuarios')
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
    db('Jugadores').where('id', '=', id)
        .update('activo', false)
        .returning('activo')
        .then(jugador => {
            res.json(jugador[0]);
        })
        .catch(err => res.status(400).json('Imposible desactivar jugador.'))
})

app.post('/jugador', (req, res) => {
    const { nombre, apellido, apodo, dni, fecha_nac, nrosocio, celular, camiseta, posicion } = req.body;
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
            .into('Jugadores')
            .returning('dni')
            .then(dni => {
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

app.post('/cobrar', (req, res) => {
    const { id_jugador, id_partido, importe_pagado, importe_partido, comentarios } = req.body;
    db.transaction(trx => {
        trx.insert({
            id_jugador: id_jugador,
            id_partido: id_partido,
            id_operacion: 1,
            importe: importe_pagado,
            comentarios: comentarios
            })
            .into('Movimientos')
            .returning('id_jugador')
            .then(jugador => {
                console.log(jugador);
                return trx('Movimientos')
                    .returning('*')
                    .insert({
                        id_jugador: id_jugador,
                        id_partido: id_partido,
                        id_operacion: 2,
                        importe: importe_partido,
                        comentarios: "Importe del Partido"
                    })
                    .then(res.json("Cobrado OK!"));
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err))
})


app.post('/register', (req, res) => {
    const { email, nombre, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('Login')
            .returning('email')
            .then(loginEmail => {
                return trx('Usuarios')
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
    db.select('*').from('users').where({ id })
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


app.listen(8080, () => {
    console.log('app is running on port 8080');
})