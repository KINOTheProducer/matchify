// initially, we will be running the user's query through Riot's summoners endpoint - this will return the summoner's info
// we will extract the puuid identifier from that information
// we will plug that into the matches endpoint to return the match IDs for the last 5 games they've played

export default async function handler(req, res) {
    const { summonerName } = req.query;
    const api = process.env.NEXT_PUBLIC_RIOT_API_KEY;
    const response = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api}`);
    const data = await response.json();
    const puuid = data.puuid;
    const matchListResponse = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${api}`);
    const matchListData = await matchListResponse.json();

    // setting a blank array to store the match information that we will grab and send to our frontend
    const matches = [];

    // creating a loop that will go through each match individually and return more detailed information
    // we will this information to find the info we need for the queried match, and only return what we want to show on the frontend
    for (let i = 0; i < matchListData.length; i++) {
        const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchListData[i]}?api_key=${api}`);
        const data = await response.json();

        // grabbing the raw duration of each match in milliseconds and converting that to a string of minutes and seconds
        const durationRaw = data.info.gameDuration;
        const durationMin = Math.floor(durationRaw / 60);
        const durationSec = durationRaw % 60;
        const durationString = `${durationMin}m ${durationSec}s`;

        // creating a nested loop here to look through the match info by participant ID
        for (const participantId in data.info.participants) {
            const player = data.info.participants[participantId];

            // once we have the player's participant ID, we can do a logic check to see if the player is the queried user
            // this way, we will only grab the information pertinent to the queried user
            if (player.summonerName.toLowerCase() === summonerName.toLowerCase()) {
                const match = {
                    id: data.info.gameId,
                    duration: durationString,
                    name: player.summonerName,
                    champion: player.championName,
                    championIcon: `https://ddragon.leagueoflegends.com/cdn/13.4.1/img/champion/${player.championName}.png`,
                    level: player.champLevel,
                    kills: player.kills,
                    assists: player.assists,
                    deaths: player.deaths,
                    kda: +Math.abs((player.kills + player.assists) / player.deaths).toFixed(1),
                    win: player.win,
                    creeps: player.totalMinionsKilled + player.neutralMinionsKilled,
                    creepsPerMin: +((player.totalMinionsKilled + player.neutralMinionsKilled) / (durationMin + (durationSec / 60))).toFixed(1)
                }
                // I will then push all the data we just grabbed about the user's matches into the matches array
                // this is done to quickly be able to access that on the frontend with a map function of the array
                matches.push(match);
                break;
            }
        }
    }
    res.status(200).json({ matches });
}