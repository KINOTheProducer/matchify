// running the user's query through Riot's API - this will return the summoner's info
// we will extract the puuid identifier from the summoner info endpoint
// we will plug that into the matches endpoint to return the match IDs for the last 5 games they've played

export default async function handler(req, res) {
    const { summonerName } = req.query;
    const api = process.env.NEXT_PUBLIC_RIOT_API_KEY;
    const response = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api}`);
    const data = await response.json();
    console.log(data)
    const puuid = data.puuid;
    const matchListResponse = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${api}`);
    const matchList = await matchListResponse.json();
    console.log(matchList);
}