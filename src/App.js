import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { apiGetCities, apiGetElections } from "./api/api";

export default function App() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingElections, setLoadingElections] = useState(true);
  const [cities, setCities] = useState([]);
  const [currentElections, setCurrentElections] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    async function getBackendData() {
      const backendCities = await apiGetCities();
      setCities(backendCities);
      setSelectedCity(backendCities[0].id);
      setLoadingPage(false);
    }
    getBackendData();
  }, []);

  useEffect(() => {
    if (!selectedCity) {
      return;
    }
    async function getBackendElections() {
      const backendElections = await apiGetElections(selectedCity);
      setCurrentElections(backendElections);
      setLoadingElections(false);
    }
    getBackendElections();
  }, [selectedCity]);

  function handleCityChange(event) {
    const newCityId = event.currentTarget.value;
    setSelectedCity(newCityId);
  }

  if (loadingPage || loadingElections) {
    return (
      <div className="text-center mt-4">
        <ClipLoader />
      </div>
    );
  }

  const { city, elections } = currentElections;
  const { name: cityName, absence, presence, votingPopulation } = city;

  return (
    <div>
      <header>
        <div className="bg-indigo-300 mx-auto p-4">
          <h1 className="text-center font-semibold text-xl">Elections</h1>
        </div>
      </header>

      <main>
        <div className="container mx-auto p-4">
          <div className="text-center">
            <select value={selectedCity} onChange={handleCityChange}>
              {cities.map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            <h2 className="font-semibold text-xl, my-4">
              Eleiçoes em {currentElections.city.name}
            </h2>
            <ul>
              <li>
                <strong>População: </strong>
                {votingPopulation}
              </li>
              <li>
                <strong>Abstenção: </strong>
                {absence}
              </li>
              <li>
                <strong>Total de votos: </strong>
                {presence}
              </li>
            </ul>

            <table>
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Candidato</th>
                  <th>Votos</th>
                  <th>%</th>
                  <th>Eleito?</th>
                </tr>
              </thead>
              <tbody>
                {elections.map((election, index) => {
                  const { id, votes, candidateName, candidateUserName } =
                    election;
                  const percent = (votes / presence) * 100;
                  const won = index === 0;
                  return (
                    <tr id={id} key={id}>
                      <td>{index + 1}</td>
                      <td>{candidateName}</td>
                      <td>{votes}</td>
                      <td>{percent.toFixed(2)}</td>
                      <td>{won ? "sim" : "não"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
