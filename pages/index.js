import React, { useState } from "react";

export default function Home() {
  const [summonerName, setSummonerName] = useState("");
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSummonerData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `api/matchinfo?summonerName=${summonerName}`
      );
      const data = await response.json();
      setMatches(data.matches);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col content-center items-center">
      <form className="flex flex-col content-center items-center mt-10 space-y-2">
        <label>
          Summoner Name:
        </label>
        <input
          className="flex flex-row content-center items-center text-center border-white border-2 rounded-md"
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          placeholder="eg. Doublelift" />
        <button type="submit" onClick={getSummonerData}>
          Search
        </button>
      </form>
    </div>
  )
}