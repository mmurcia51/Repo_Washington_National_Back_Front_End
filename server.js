const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();
const port = process.env.PORT || 8080;

let redisClient;

(async () => {
  redisClient = redis.createClient({ url: "redis://localhost:6379" });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

async function fetchApiData(species) {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${species}`
  );
  console.log("Solicitud enviada a API");
  return apiResponse.data;
}

async function getSpeciesData(req, res) {
  const species = req.params.species;
  let results;

  try {
    results = await fetchApiData(species);
    if (results.length === 0) {
      throw "El API retorno arreglo vacio";
    }
	//console.log(results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Informacion no disponible");
  }
}

async function getSpeciesDataCache(req, res) {
  const species = req.params.species;
  let results;
  let isCached = false;

  try {
    const cacheResults = await redisClient.get(species);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchApiData(species);
      if (results.length === 0) {
        throw "El API retorno arreglo vacio";
      }
      await redisClient.set(species, JSON.stringify(results));
    }

    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Informacion no disponible");
  }
}

app.get("/cache/:species/sin-cache", getSpeciesData);
app.get("/cache/:species/con-cache", getSpeciesDataCache);

app.listen(port, () => {
  console.log(`App escuchando en puerto ${port}`);
});
