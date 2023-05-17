import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { Model } from 'sequelize';

import { app } from '../app';
import Matche from '../database/models/MatcheModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Verifica endpoint matches', () => {
  beforeEach(sinon.restore);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiQWRtaW4ifSwiaWF0IjoxNjc3NzYzODg0LCJleHAiOjE2Nzg2Mjc4ODR9.e5GVmFHZ9ZWiZ5Lc7kMNhXZjEu_DqnuMMwjRotatThY";

  const matcherList = [
    new Matche({
      id: 1,
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2,
      awayTeamGoals: 2,
      inProgress: true
    }),
    new Matche({
      id: 2,
      homeTeamId: 3,
      homeTeamGoals: 7,
      awayTeamId: 4,
      awayTeamGoals: 1,
      inProgress: false,
    }),
  ]

  const matcherListControl = [
    {
      id: 1,
      homeTeamId: 1,
      homeTeamGoals: 3,
      awayTeamId: 2,
      awayTeamGoals: 2,
      inProgress: true
    },
    {
      id: 2,
      homeTeamId: 3,
      homeTeamGoals: 7,
      awayTeamId: 4,
      awayTeamGoals: 1,
      inProgress: false
    }
  ]

  const createMatch = {
    homeTeamId: 1,
    homeTeamGoals: 1,
    awayTeamId: 2,
    awayTeamGoals: 2,
    inProgress: true,
  };

  const createMatchError = {
    homeTeamId: 1,
    homeTeamGoals: 1,
    awayTeamId: 1,
    awayTeamGoals: 2,
    inProgress: true,
  };

  it('Verifica get', async () => {
    sinon.stub(Model, 'findAll').resolves(matcherList);

    const result = await chai.request(app).get('/matches')

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal(matcherListControl);
  });

  it('Verifica get com inProgress true', async () => {
    sinon.stub(Model, 'findAll').resolves(matcherList);

    const result = await chai.request(app).get('/matches?inProgress=true');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal([matcherListControl[0]]);
  });

  it('Testa get com inProgress false', async () => {
    sinon.stub(Model, 'findAll').resolves(matcherList);

    const result = await chai.request(app).get('/matches?inProgress=false');

    expect(result.status).to.be.equal(200);
    expect(result.body).to.deep.equal([matcherListControl[1]]);
  });

  it('Verifica finish sem token', async () => {
    sinon.stub(Model, 'update').resolves();

    const result = await chai.request(app).patch('/matches/1/finish');

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Token not found' });
  });

  it('Verifica finish com token inválido', async () => {
    sinon.stub(Model, 'update').resolves();

    const result = await chai.request(app).patch('/matches/1/finish').set('Authorization','is4');

    expect(result.status).to.be.equal(401);
    expect(result.body).to.deep.equal({ message: 'Token must be a valid token' });
  });

it('Verifica finish com token válido', async () => {
  sinon.stub(Model, 'update').resolves();

  const result = await chai.request(app).patch('/matches/1/finish').set({ Authorization: `${ token }`});

  expect(result.status).to.be.equal(200);
  expect(result.body).to.deep.equal({ message: 'Finished' });
});

it('Verifica create', async () => {
  sinon.stub(Model, 'create').resolves(matcherList[1]);

  const result = await chai.request(app).post('/matches').send(createMatch).set({ Authorization: `${ token }`});

  expect(result.status).to.be.equal(201);
  expect(result.body).to.deep.equal(matcherListControl[1]);
});

it('Verifica create para dois times iguais', async () => {
  sinon.stub(Model, 'create').resolves(matcherList[1]);

  const result = await chai.request(app).post('/matches').send(createMatchError).set({ Authorization: `${ token }`});

  expect(result.status).to.be.equal(422);
  expect(result.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
});

it('Verifica create 1 ou 2 id não existentes', async () => {
  sinon.stub(Model, 'findByPk').resolves(null);
  sinon.stub(Model, 'create').resolves(matcherList[1]);

  const result = await chai.request(app).post('/matches').send(createMatch).set({ Authorization: `${ token }`});

  expect(result.status).to.be.equal(404);
  expect(result.body).to.deep.equal({ message: 'There is no team with such id!' });
  });
});