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
    <div className="flex flex-col w-full h-full m-auto place-content-center content-center items-center align-middle justify-center">
      <h1 className="text-7xl font-bold text-center secondary mt-10">matchify.</h1>
      <h2 className="text-xl font-semibold text center mt-4">Enter a summoner name below:</h2>
      <form
        className="flex flex-col content-center items-center space-y-2 align-middle justify-center w-50 h-100 mt-5 mb-10"
        onSubmit={formSubmit}>
        {/* <label>
          Summoner Name:
        </label> */}
        <input
          className="flex flex-row content-center items-center text-center border-white border-2 rounded-md"
          type="text"
          value={summonerName}
          onChange={(e) => setSummonerName(e.target.value)}
          placeholder="eg. Doublelift" />
        <button className="btn secondary-bg" type="submit" onClick={getSummonerData}>
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
                    <>
                      <div className="flex flex-row space-x-14 m-5 place-content-center items-center text-center" key={matches.id}>
                        <div className="flex flex-col place-content-center items-center text-center">

                          <div className={`${matches.win
                            ? 'rounded-full border-4 border-green-400'
                            : 'rounded-full border-4 border-red-400'
                            }`}>
                            <Image
                              width={100}
                              height={100}
                              src={matches.championIcon}
                              alt={matches.champion}
                              className="rounded-full object-none" />
                          </div>

                          <div className="w-8 h-8 py-1 place-content-center items-center text-center absolute pb-[8rem] pl-7 scale-75 md:scale-100 md:pb-[10rem] md:pl-12 ">
                            <h2 className="level p-0.5 font-semibold rounded-full w-8 h-8 border-2">
                              {matches.level}
                            </h2>
                          </div>

                          <div className="w-10 h-10 py-1 place-content-center items-center text-center absolute md:pt-[1.6rem]">
                            {matches.win
                              ?
                              <h2 className="label win font-bold text-sm">Win</h2>
                              :
                              <h2 className="label loss font-bold text-sm">Loss</h2>}
                          </div>

                          <div className="place-content-center items-center text-center mt-3">
                            <h2 className="font-semibold">{matches.champion}</h2>
                            <h2 className="text-sm">{matches.duration}</h2>
                          </div>
                        </div>

                        <div className="flex flex-col place-content-center items-center text-center">
                          <h2 className="font-bold text-lg md:text-xl">{matches.kills} / {matches.deaths} / {matches.assists}</h2>
                          <h2 className="text-sm">{matches.kda} KDA</h2>

                        </div>

                        <div className="flex flex-col place-content-center items-center text-center">
                          <h2 className="font-semibold text-lg">{matches.creeps} CS</h2>
                          <h4 className="text-sm">({matches.creepsPerMin}/min)</h4>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <div className="flex flex-row">
                            Items:
                          </div>
                          <div className="flex flex-row w-auto h-auto space-x-1">
                            {matches.item1 && (
                              <Image
                                width={50}
                                height={50}
                                src={matches.item1}
                                alt="First Item"
                              />
                            )}
                            {matches.item2 && (
                              <Image
                                width={50}
                                height={50}
                                src={matches.item2}
                                alt="Second Item"
                              />
                            )}
                            {matches.item3 && (
                              <Image
                                width={50}
                                height={50}
                                src={matches.item3}
                                alt="Third Item"
                              />
                            )}
                          </div>
                          <div className="flex flex-row w-auto h-auto space-x-1">
                            {matches.item4 && (
                              <Image
                                width={50}
                                height={50}
                                src={matches.item4}
                                alt="Fourth Item"
                              />
                            )}
                            {matches.item5 && (
                              <Image
                                width={50}
                                height={50}
                                src={matches.item5}
                                alt="Fifth Item"
                              />
                            )}
                            {matches.item6 && (
                              <Image
                                width={50}
                                height={50}
                                src={matches.item6}
                                alt="Sixth Item"
                              />
                            )}
                          </div>
                        </div>

                      </div>
                      <hr className="w-[30vw]" />
                    </>
                  )
                })}
              </div>
            )}
          </div>
      }
    </div>
  )
}