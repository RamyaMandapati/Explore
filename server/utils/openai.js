const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

// const configuration = new Configuration({
//   apiKey: "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",
// });
const openai = new OpenAI({
  apiKey: "",
});
const model = "text-davinci-003";
const completions = 5;
const options = {
  maxTokens: 5,
  temperature: 0.5,
  n: 1,
  stop: "\n\n",
};

async function openaiquery(prompt) {
  const response = await openai.completions.create({
    model: model,
    prompt: prompt,
    max_tokens: 1200,
    temperature: 0.5,
    n: 1,
  });
  return response.choices[0].text.trim();
}

module.exports = { openaiquery };
