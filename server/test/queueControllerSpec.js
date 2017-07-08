const test = require('tape');
const app = require('../index');
const supertest = require('supertest');
const api = supertest(app);

test('checking endpoints with html', t=> {
    api.get('/endpoint')
        .query({jobType: 'html', jobId: 1})
        .end(function (err, res) {
            console.log("res=",JSON.stringify(res));
            t.equals(res.status, 200, 'Status code should be 200');
            t.equals(res.header['content-type'], "application/json; charset=utf-8", "content type of response should be json");

            t.end();
        });
});

test('checking endpoints with pdf', t=> {
    api.get('/endpoint')
        .query({jobType: 'pdf', jobId: 1})
        .end(function (err, res) {
            console.log("res=",JSON.stringify(res));
            t.equals(res.status, 200, 'Status code should be 200');
            t.equals(res.header['content-type'], "application/json; charset=utf-8", "content type of response should be json");

            t.end();
        });
});