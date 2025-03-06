const fs = require("fs");
const fetch = require("node-fetch");
const { YOUTUBE_API_KEY } = require("./config");
const { YOUTUBE_API_KEY2 } = require("./config");


if (!YOUTUBE_API_KEY) {
  throw new Error("No API key is provided");
}

async function getYoutubeResults(query, channel, resultsPerPage, pageToken) {
  console.log("Ready to get Youtube data!");
  let url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=id&type=video&videoEmbeddable=true&channelId=${channel}&q=${query}`;
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

async function getYoutubeResults2(query, channel, resultsPerPage, pageToken) {
  console.log("Ready to get Youtube data!");
  let url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=id&type=video&videoEmbeddable=true&q=${query}`;
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

async function getChannelResults(query, resultsPerPage, pageToken) {
  console.log("Ready to get Youtube data!");
  let url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY2}&part=snippet&type=channel&q=${query}`;
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


async function main(keyword, channel) {
  const videoData = [];

  let totalPages = 1;
  let nextPageToken = undefined;

  for (let counter = 0; counter < totalPages; counter = counter + 1) {
    const data = await getYoutubeResults(keyword, channel, 1, nextPageToken);
    videoData.push(...data.items);
    nextPageToken = data.nextPageToken;
  }

  const videoDataJSON = JSON.stringify(videoData, null, 2);
  fs.writeFileSync("./data.json", videoDataJSON);
}

async function main2(channel)
{
  const channelData = [];

  let totalPages = 1;
  let nextPageToken = undefined;

  for (let counter = 0; counter < totalPages; counter = counter + 1) {
    const data = await getChannelResults(channel, 1, nextPageToken);
    channelData.push(...data.items);
    nextPageToken = data.nextPageToken;
  }

  const channelDataJSON = JSON.stringify(channelData, null, 2);
  fs.writeFileSync("./channeldata.json", channelDataJSON);
}

async function main3(keyword) {
  const videoData = [];

  let totalPages = 1;
  let nextPageToken = undefined;

  for (let counter = 0; counter < totalPages; counter = counter + 1) {
    const data = await getYoutubeResults2(keyword, 1, nextPageToken);
    videoData.push(...data.items);
    nextPageToken = data.nextPageToken;
  }

  const videoDataJSON = JSON.stringify(videoData, null, 2);
  fs.writeFileSync("./data.json", videoDataJSON);
}


module.exports = {
  main,
  main2,
  main3
};
