import axiosModule from "axios";

const axios = axiosModule.create({ baseURL: "http://localhost:3001/" });

async function apiGetCities() {
  const { data: cities } = await axios.get("/cities");
  cities.sort((a, b) => a.name.localeCompare(b.name));
  return cities;
}

async function apiGetCandidates() {
  const { data: candidates } = await axios.get("/candidates");
  return candidates;
}

async function apiGetElections(cityId) {
  const [candidates, cities, { data: elections }] = await Promise.all([
    apiGetCandidates(),
    apiGetCities(),
    await axios.get(`/election?cityId=${cityId}`),
  ]);

  const selectedCity = cities.find((city) => city.id === cityId);

  let result = elections
    .sort((a, b) => b.votes - a.votes)
    .map((election) => {
      const { name, username } = candidates.find(
        (candidate) => candidate.id === election.candidateId
      );
      const { votes, id } = election;
      return {
        id,
        candidateName: name,
        candidateUserName: username,
        votes,
      };
    });

  result = { city: selectedCity, elections: result };
  return result;
}

export { apiGetCities, apiGetCandidates, apiGetElections };
