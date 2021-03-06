const express = require("express");
const { uuid, isUuid } = require('uuidv4');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateRepositoryId = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], title, url, techs };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'Repository not found.' });
  }

  const { likes } = repositories[repositoryIndex];

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], likes: likes + 1 };

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
