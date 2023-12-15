import { GoogleImageSearchResponse } from "../type/google";

export default async function findImages(q: string) {
  const qObj = {
    q,
    key: process.env.GOOGLE_API_KEY!,
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID!,
    safe: "high",
    num: "5",
    searchType: "image",
    imgSize: "huge",
    imgType: "photo",
    lr: "lang_en",
  };

  const queryString = new URLSearchParams(qObj).toString();

  const SEARCH_URL = `https://www.googleapis.com/customsearch/v1?${queryString}`;

  const result: GoogleImageSearchResponse = await fetch(SEARCH_URL).then(
    (response) => response.json(),
  );

  return result.items;
}
