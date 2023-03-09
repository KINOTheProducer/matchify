import React, { useState } from "react";
import Image from "next/image";

export default function Home() {
  // this will be the name sent to the backend
  const [summonerName, setSummonerName] = useState("");

  // this is the same as the summonerName, but it will be a static version of it
  // so if a user starts typing in the input box, it won't change the text on the match list
  const [staticName, setStaticName] = useState("");

  // this will represent our match information coming in from the backend
  const [matches, setMatches] = useState([]);

  // this will control our load state, so we can indicate that the request is being worked on in the backend
  const [isLoading, setIsLoading] = useState(false);

  // this will take the user's submitted summoner name and send it to the backend
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

  // this is our form's onSubmit function
  // it prevents refreshing and sets our static name to the summoner name for use throughout the frontend
  function formSubmit(event) {
    event.preventDefault();
    const nameArr = summonerName.toLowerCase().split(" ");
    for (var i = 0; i < nameArr.length; i++) {
      nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1);
    }
    const capsStaticName = nameArr.join(" ");
    setStaticName(capsStaticName);
  }

  return (
    <div className="flex flex-col content-center items-center">
      <form
        className="flex flex-col content-center items-center mt-10 space-y-2"
        onSubmit={formSubmit}>
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

      {
        isLoading ? (
          <h1>Pulling up matches for {staticName}...</h1>
        ) :
          <div>
            {matches.length === 0 ? null : (
              <div className="flex flex-col w-auto h-auto bg-slate-400 bg-opacity-10 p-5 rounded-xl place-content-center items-center text-center">
                <h1 className="text-2xl font-bold">Match history for {staticName}</h1>

                {matches.map((matches) => {
                  return (
                    <div className="flex flex-col place-content-center items-center text-center" key={matches.id}>

                      <Image
                        width={100}
                        height={100}
                        src={matches.championIcon}
                        alt={matches.champion}
                        className="rounded-full object-none" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
      }
    </div>
  )
}