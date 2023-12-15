import { SerapiResponse } from "../type/serapi";

export default async function findImages(q: string) {
  const query = "puppies";

  const URL = `https://serpapi.com/search.json?q=${query}&engine=google_images&ijn=0`;
  const SEARRCH_URL = `https://www.googleapis.com/customsearch/v1?`;

  const result: SerapiResponse = await fetch(URL).then((response) =>
    response.json(),
  );

  console.log(result);

  return result.images_results;
}
