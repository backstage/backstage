const express = require('express'); // eslint-disable-line

const problems = require('./problems.json');

const app = express();

app.get('/problems', (req, res) => {
  if (req.headers.authorization !== 'Api-Token mock') {
    res.status(401).send('Unauthorized').end();
  } else {
    const pp = { ...problems };
    const entityName =
      req.query.entitySelector.match(/entityId\(\"(.*)\"\)/)[1];
    const filteredProblems = problems.problems.filter(p => {
      return (
        p.rootCauseEntity.name === entityName ||
        p.affectedEntities.filter(i => i.name === entityName).length > 0
      );
    });
    res.send(Object.assign(pp, { problems: filteredProblems })).end();
  }
});

app.listen(3001, () => {
  console.log('mock dynatrace API listening on 3001!'); // eslint-disable-line
});
