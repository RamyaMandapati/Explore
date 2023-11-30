const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const model = "gpt-4";
const completions = 5;
const options = {
  maxTokens: 5,
  temperature: 0,
  n: 1,
  stop: "\n\n",
};

async function openaiquery(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a travel itinerary planner.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
    max_tokens: 1215,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  // console.log(response.choices[0].message.content);
  if (response) {
    const placesObject = JSON.parse(response.choices[0].message.content);
    return placesObject;
  }
}
module.exports = { openaiquery };
