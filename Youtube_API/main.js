const fs = require("fs");
const fetch = require("node-fetch");
const { YOUTUBE_API_KEY } = require("./config");

if (!YOUTUBE_API_KEY) {
  throw new Error("No API key is provided");
}

async function getYoutubeResults(query, resultsPerPage, pageToken) {
  console.log("Ready to get Youtube data!");
  let url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=${query}`;
  if (resultsPerPage) {
    url = `${url}&maxResults=${resultsPerPage}`;
  }
  if (pageToken) {
    url = `${url}&pageToken=${pageToken}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  return data;
}

async function main(keyword) {
  const videoData = [];

  let totalPages = 1;
  let nextPageToken = undefined;

  for (let counter = 0; counter < totalPages; counter = counter + 1) {
    const data = await getYoutubeResults(keyword, 1, nextPageToken);
    videoData.push(...data.items);
    nextPageToken = data.nextPageToken;
  }

  const videoDataJSON = JSON.stringify(videoData, null, 2);
  fs.writeFileSync("./data.json", videoDataJSON);



}



module.exports.main = main;
