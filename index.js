const express = require('express');
const app = express();
let Person = require('./models/person');
const morgan = require('morgan');
const cors = require('cors');

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const personID = () => {
    return Math.floor(Math.random() * 1000);
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: ' Name or number missing',
        });
    }
    Person.findOne({name: body.name}).then((existingPerson) => {
        if (existingPerson) {
            return response.status(400).json({
                error: 'Name must be unique',
            });
        }

        const newPerson = new Person({
            name: body.name,
            number: body.number,
        });

        newPerson
            .save()
            .then((savedPerson) => {
                response.json(savedPerson);
            })
            .catch((error) => {
                response
                    .status(500)
                    .json({error: 'Could not save person to database'});
            })
            .catch((error) => next(error));
    });
});
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then((persons) => {
            response.json(persons);
        })
        .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.get('/info', (request, response) => {
    const requestDate = new Date().toISOString().split('T')[0];
    const requestTime = new Date().toLocaleTimeString();
    const personLength = Person.length;
    response.send(
        `<p>Phonebook has info for ${personLength} people </p> <p> Get request done in ${requestDate} ${requestTime} </p>`,
    );
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id).then(() => {
        response.status(204).end();
    });
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'});
    }

    next(error);
};

app.use(errorHandler);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
