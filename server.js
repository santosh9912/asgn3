const express = require('express');
const siteData = require('./modules/data-service');
const path = require('path');
const app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/public'));

siteData
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize data:', err);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/sites', (req, res) => {
  const region = req.query.region;
  if (region) {
    siteData
      .getSitesByRegion(region)
      .then((data) => {
        if (data.length > 0) {
          res.json(data);
        } else {
          res.status(404).json({ message: 'No sites found for the specified region.' });
        }
      })
      .catch((err) => res.status(500).send(err));
  } else {
    siteData
      .getAllSites()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).send(err));
  }
});

app.get('/sites/:siteId', (req, res) => {
  const siteId = req.params.siteId;
  siteData
    .getSiteById(siteId)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ message: 'Site not found.' });
      }
    })
    .catch((err) => res.status(500).send(err));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});