import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  organization: process.env.organizationKey,
  apiKey: process.env.openApiKey,
});
const openai = new OpenAIApi(configuration);

const model = "text-davinci-003";
const completions = 5;
const options = {
  maxTokens: 5,
  temperature: 0.5,
  n: 1,
  stop: "\n\n",
};

async function openaiquery(prompt) {
  const response = await openai.createCompletion({
    model: model,
    prompt: prompt,
    max_tokens: 1200,
    temperature: 0.5,
    n: 1,
  });
  return response.data.choices[0].text.trim();
}

export default openaiquery;
