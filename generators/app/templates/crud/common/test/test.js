const config = require('config');
// modify config for unit test
config.Database = config.Unittest.Database;

const App = require('../app');
const supertest = require('supertest');
const shortId = require('../api/helpers/shortId');
const logger = require('../logger');
logger('unittest.log').switchToFile();
require('should');
const v1BasePath = config.App.v1Path;

describe('<%= objectName %>Service', async function () {
  let request;
  let port = Math.floor(Math.random() * 10000);
  before(async function () {
    // initialize middle ware - DB connect
    await App.start();
    request = supertest.agent(App.app).host(`http://localhost:${port}`).set({
      'X-Correlation-Id': shortId.generate(),
      'Content-Type': 'application/json'
    });
  });

  after(async function () {
    await App.stop();
  });

  afterEach(async function () {
    // delete all resources
    await request
      .delete(v1BasePath + '/<%= objectNameLowerCase %>s')
      .set('Accept', 'application/json')
      .expect(200);
  });

  function createReq() {
    return {
      name: `name${Math.floor(Math.random() * 10000)}`,
      age: Math.floor(Math.random() * 100),
      address: `Address ${Math.floor(Math.random() * 10000)}`,
      country: 'USA'
    };
  }

  async function bulkCreate<%= objectName %>s(count) {
    // create n <%= objectNameLowerCase %>s
    let promises = [];
    for (let index = 0; index < count; index++) {
      const promise = request
        .post(v1BasePath + '/<%= objectNameLowerCase %>s')
        .set('Accept', 'application/json')
        .send(createReq())
        .expect(200);
      promises.push(promise);
    }
    // resolve all promises
    await Promise.all(promises);
  }

  describe('CreateUpdateDelete', async function () {
    describe('Get<%= objectName %>s', async function () {
      it('FailAdditionalQueryParameter', async function () {
        await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s?skip=20&unknown=test')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400);
      });

      it('FailGet<%= objectName %>RandomId', async function () {
        // get all <%= objectNameLowerCase %>s
        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);

        await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + 'randomId')
          .set('Accept', 'application/json')
          .expect(404);
      });

      it('get<%= objectName %>', async function () {
        // get all <%= objectNameLowerCase %>s
        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);

        const req = createReq();
        const res = await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        res.body.should.have.property('name', req.name);
        res.body.should.have.property('age', req.age);
        res.body.should.have.property('address', req.address);
        res.body.should.have.property('id');
        const <%= objectNameLowerCase %>Id = res.body.id;

        // get <%= objectNameLowerCase %> and check properties
        let <%= objectNameLowerCase %> = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        <%= objectNameLowerCase %>.body.should.have.property('name', req.name);
        <%= objectNameLowerCase %>.body.should.have.property('age', req.age);
        <%= objectNameLowerCase %>.body.should.have.property('address', req.address);
        <%= objectNameLowerCase %>.body.should.have.property('id', <%= objectNameLowerCase %>Id);
      });

      it('getAll<%= objectName %>s', async function () {
        // get all <%= objectNameLowerCase %>s
        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);
        const count = 3;
        await bulkCreate<%= objectName %>s(count);
        // get <%= objectNameLowerCase %> and check properties
        <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', count);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(count);
      });
    });

    describe('Create<%= objectName %>', async function () {
      it('FailCreateNoName', async function () {
        const req = createReq();
        delete req.name;
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);

        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);
      });

      it('FailCreateInvalidName', async function () {
        const req = createReq();
        req.name = '$*name';
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);

        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);
      });

      it('FailCreateNoAddress', async function () {
        const req = createReq();
        delete req.address;
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);

        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);
      });

      it('FailCreateRandomAddress', async function () {
        const req = createReq();
        req.address = '$%Address';
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);

        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);
      });

      it('FailCreateNoAge', async function () {
        const req = createReq();
        delete req.age;
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);

        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);
      });

      it('FailCreateRandomAge', async function () {
        const req = createReq();
        req.age = -1; // min age is 0
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);
        req.age = 151; //max age is 150
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);

        req.age = '150'; // age should be a string
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(400);

        let <%= objectNameLowerCase %>s = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);

        <%= objectNameLowerCase %>s.body.should.have.property('count', 0);
        <%= objectNameLowerCase %>s.body.should.have.property('values');
        <%= objectNameLowerCase %>s.body.values.length.should.be.eql(0);
      });

      it('create<%= objectName %>', async function () {
        const req = createReq();
        const res = await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        res.body.should.have.property('name', req.name);
        res.body.should.have.property('age', req.age);
        res.body.should.have.property('address', req.address);
        res.body.should.have.property('id');
        const <%= objectNameLowerCase %>Id = res.body.id;
        // get <%= objectNameLowerCase %> and check properties
        const <%= objectNameLowerCase %> = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        <%= objectNameLowerCase %>.body.should.have.property('name', req.name);
        <%= objectNameLowerCase %>.body.should.have.property('age', req.age);
        <%= objectNameLowerCase %>.body.should.have.property('address', req.address);
        <%= objectNameLowerCase %>.body.should.have.property('id', <%= objectNameLowerCase %>Id);
      });

      it('create<%= objectName %>WithoutCountry', async function () {
        const req = createReq();
        delete req.country;
        const res = await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        res.body.should.have.property('name', req.name);
        res.body.should.have.property('age', req.age);
        res.body.should.not.have.property('country');
        res.body.should.have.property('id');
        const <%= objectNameLowerCase %>Id = res.body.id;
        // get <%= objectNameLowerCase %> and check properties
        const <%= objectNameLowerCase %> = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        <%= objectNameLowerCase %>.body.should.have.property('name', req.name);
        <%= objectNameLowerCase %>.body.should.have.property('age', req.age);
        res.body.should.not.have.property('country');
        <%= objectNameLowerCase %>.body.should.have.property('id', <%= objectNameLowerCase %>Id);
      });
    });

    describe('Update<%= objectName %>', async function () {
      it('FailUpdateRandom<%= objectName %>', async function () {
        const req = createReq();
        await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);

        const <%= objectNameLowerCase %>NamePatchReq = {
          name: 'someRandomName'
        };
        await request
          .patch(v1BasePath + '/<%= objectNameLowerCase %>s/' + 'random<%= objectName %>Id')
          .set('Accept', 'application/json')
          .send(<%= objectNameLowerCase %>NamePatchReq)
          .expect(404);
      });

      it('Update<%= objectName %>', async function () {
        const req = createReq();
        const res = await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        const <%= objectNameLowerCase %>Id = res.body.id;

        // update name
        const <%= objectNameLowerCase %>NamePatchReq = {
          name: 'someRandomName'
        };
        await request
          .patch(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .send(<%= objectNameLowerCase %>NamePatchReq)
          .expect(200);
        // get <%= objectNameLowerCase %> and check name
        let <%= objectNameLowerCase %> = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .expect(200);
        <%= objectNameLowerCase %>.body.should.have.property('name', <%= objectNameLowerCase %>NamePatchReq.name);
        <%= objectNameLowerCase %>.body.should.have.property('age', req.age);
        <%= objectNameLowerCase %>.body.should.have.property('address', req.address);
        <%= objectNameLowerCase %>.body.should.have.property('id', <%= objectNameLowerCase %>Id);

        // update age
        const <%= objectNameLowerCase %>AgePatchReq = {
          age: 12
        };
        await request
          .patch(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .send(<%= objectNameLowerCase %>AgePatchReq)
          .expect(200);
        // get <%= objectNameLowerCase %> and check age
        <%= objectNameLowerCase %> = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .expect(200);
        <%= objectNameLowerCase %>.body.should.have.property('name', <%= objectNameLowerCase %>NamePatchReq.name);
        <%= objectNameLowerCase %>.body.should.have.property('age', <%= objectNameLowerCase %>AgePatchReq.age);
        <%= objectNameLowerCase %>.body.should.have.property('address', req.address);
        <%= objectNameLowerCase %>.body.should.have.property('id', <%= objectNameLowerCase %>Id);

        // update address
        const updateAddressPatchReq = {
          address: 'some Address'
        };
        await request
          .patch(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .send(updateAddressPatchReq)
          .expect(200);
        // get <%= objectNameLowerCase %> and check address
        <%= objectNameLowerCase %> = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .expect(200);
        <%= objectNameLowerCase %>.body.should.have.property('name', <%= objectNameLowerCase %>NamePatchReq.name);
        <%= objectNameLowerCase %>.body.should.have.property('age', <%= objectNameLowerCase %>AgePatchReq.age);
        <%= objectNameLowerCase %>.body.should.have.property(
          'address',
          updateAddressPatchReq.address
        );
        <%= objectNameLowerCase %>.body.should.have.property('id', <%= objectNameLowerCase %>Id);
      });
    });

    describe('Delete<%= objectName %>s', async function () {
      it('FailDelete<%= objectName %>RandomId', async function () {
        const req = createReq();
        const res = await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        res.body.should.have.property('name', req.name);
        res.body.should.have.property('age', req.age);
        res.body.should.have.property('address', req.address);
        res.body.should.have.property('id');
        const <%= objectNameLowerCase %>Id = res.body.id;

        await request
          .delete(v1BasePath + '/<%= objectNameLowerCase %>s/' + 'randomId')
          .set('Accept', 'application/json')
          .expect(404);
        // get <%= objectNameLowerCase %> again and check
        await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .expect(200);
      });

      it('Delete<%= objectName %>', async function () {
        const req = createReq();
        let res = await request
          .post(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .send(req)
          .expect(200);
        res.body.should.have.property('name', req.name);
        res.body.should.have.property('age', req.age);
        res.body.should.have.property('address', req.address);
        res.body.should.have.property('id');
        const <%= objectNameLowerCase %>Id = res.body.id;

        await request
          .delete(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .expect(204);
        // get <%= objectNameLowerCase %> and fail
        await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s/' + <%= objectNameLowerCase %>Id)
          .set('Accept', 'application/json')
          .expect(404);
        // get all <%= objectNameLowerCase %>s
        res = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);
        res.body.should.have.property('count', 0);
        res.body.should.have.property('values');
        res.body.values.length.should.be.eql(0);
      });

      it('DeleteAll<%= objectName %>s', async function () {
        const count = 3;
        await bulkCreate<%= objectName %>s(count);

        let res = await request
          .get(v1BasePath + '/<%= objectNameLowerCase %>s')
          .set('Accept', 'application/json')
          .expect(200);
        res.body.should.have.property('count', count);
        res.body.should.have.property('values');
        res.body.values.length.should.be.eql(count);
      });
    });
  });
});
