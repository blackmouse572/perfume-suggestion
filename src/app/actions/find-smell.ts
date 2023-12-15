"use server";

import { IFindSmellFormData } from "@/components/register-form";
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import { IResult } from "../type/result";
import findImages from "./find-images";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_KEY!),
});

const MODEL_NAME = "models/text-bison-001";

export default async function findSmell(data: IFindSmellFormData) {
  const { occasion, name, gender, characteristics } = data;

  const promptString = `give me 4 suggestions of perfume of the following requirements:
- About myself: ${characteristics}
- About my uses: ${occasion}
- My gender: ${gender}
create a JSON object which have the following structure inside the triple quote and DO NOT Provide any further information:
{
    &quot;name&quot;: &quot;&lt;name of perfume&gt;&quot;,
    &quot;description&quot;: &quot;&lt;perfume&#39;s description min 200 chars &gt;&quot;,
    &quot;tags&quot;: [
        &quot;&lt;tags&gt;&quot;
    ],
    &quot;type&quot;: &quot;&lt;perfume type (perfume/cologne/body mist)&gt;&quot;,
    &quot;match&quot;: &quot;&lt;description why user is matching with this product, min 200 chars &gt;&quot;,
    &quot;meta&quot;: {
        &quot;brand&quot;: &quot;&lt;brand of the perfume&gt;&quot;,
        &quot;style&quot;: &quot;&lt;perfume style&gt;&quot;,
        &quot;incense&quot;: &quot;&lt;perfume incense group&gt;&quot;,
        &quot;origin&quot;: &quot;&lt;Where perfume was born&gt;&quot;
    }
}
`;
  const stopSequences: string[] = [];

  const res = await client
    .generateText({
      // required, which model to use to generate the result
      model: MODEL_NAME,
      // optional, 0.0 always uses the highest-probability result
      temperature: 0.4,
      // optional, how many candidate results to generate
      candidateCount: 1,
      // optional, number of most probable tokens to consider for generation
      topK: 40,
      // optional, for nucleus sampling decoding strategy
      topP: 0.95,
      // optional, maximum number of output tokens to generate
      maxOutputTokens: 1024,
      // optional, sequences at which to stop model generation
      stopSequences: stopSequences,
      // optional, safety settings
      safetySettings: [
        {
          category: "HARM_CATEGORY_DEROGATORY",
          threshold: "BLOCK_LOW_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_TOXICITY",
          threshold: "BLOCK_LOW_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_VIOLENCE",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUAL",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_MEDICAL",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
      prompt: {
        text: promptString,
      },
    })
    .then((result) => {
      if (
        result == null ||
        result == undefined ||
        result[0] == null ||
        result[0] == undefined
      ) {
        return undefined;
      }

      if (result[0]!.candidates == undefined) {
        return undefined;
      }

      return result[0].candidates[0]!.output?.replaceAll("```", "").replaceAll(
        "json",
        "",
      );
    });

  if (res == undefined) {
    return [];
  }

  const result: IResult[] = JSON.parse(res);

  const names = result.map((r) => `${r.name} ${r.meta?.brand}`);

  const image_result = await Promise.all(names.map((name) => findImages(name)));

  //Append  images to result
  result.forEach((r, i) => {
    if (r.meta == undefined) {
      r.meta = {
        image: {
          src: image_result[i][0].link,
          width: image_result[i][0].image.width,
          height: image_result[i][0].image.height,
          contextLink: image_result[i][0].image.contextLink,
        },
        brand: "",
        style: "",
        incense: "",
      };
    }
    r.meta.image = {
      src: image_result[i][0].link,
      width: image_result[i][0].image.width,
      height: image_result[i][0].image.height,
      contextLink: image_result[i][0].image.contextLink,
    };
  });

  return result;
}
