const app = require('../app')
const request = require('supertest')
const { response } = require('../app')

describe('GET/planets', function () {
    it('responds with json', function (done) {
        request(app).get('/planets').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done)
    })
})

describe('GET/launches', function () {
    it('responds with json', function (done) {
        request(app).get('/launches').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done)
    })
})

describe('POST/launches', function () {
    it('return bad request if missing require launch property', function (done) {
        const data = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer ISI',
            launchDate: new Date('May 17, 2023')
        }
        request(app).post('/launches').send(data).set('Accept', 'application/json').expect('Content-Type', /json/).expect(400, done)
    })
    it('return bad request if invalid launch date', function (done) {
        const data = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer ISI',
            launchDate: 'hello',
            target: 'Kepler X1'
        }
        request(app).post('/launches').send(data).set('Accept', 'application/json').expect('Content-Type', /json/).expect(400, done)
    })
    it('return status code 201 if launch is passed', function (done) {
        const data = {
            mission: 'Kepler Exploration X',
            rocket: 'Explorer ISI',
            launchDate: new Date('December 30, 2030'),
            target: 'Kepler-442 b'
        }
        request(app).post('/launches').send(data).set('Accept', 'application/json').expect('Content-Type', /json/).expect(201, done)
    })
})
describe('DELETE /launches', function () {
    it('returns not found if launch ID is not existed', function (done) {
        request(app).delete('/launches/200').set('Accept', 'application/json').expect('Content-Type', /json/).expect(404, done);
    });
    it('returns status 200 and set coming = false and sucess = false if deleted launch', async function () {
        const response = await request(app).delete('/launches/100').set('Accept', 'application/json')
        expect(response.statusCode).toEqual(200);
        expect(response.body.upcoming).toEqual(false);
        expect(response.body.success).toEqual(false);
    });
});