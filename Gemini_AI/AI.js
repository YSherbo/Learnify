const AI = require("@google/generative-ai");
const fs = require("fs");

const API_KEY = process.env.AIAPI;
const genAI = new AI.GoogleGenerativeAI(API_KEY);

async function run(question) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(question);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error in AI API call:", error);
        throw error;
    }
}

async function run2(question) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(question);
        const response = await result.response;
        const responsejson = JSON.parse(response.text());
        await fs.writeFileSync("./response.json", JSON.stringify(responsejson, null, 2));
    } catch (error) {
        console.error("Error in AI API call:", error);
        throw error;
    }
}


async function run3(question) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash", 
            tools: [
                {
                    googleSearch: {  // Changed googleSearchRetrieval to googleSearch
                        // dynamicRetrievalConfig is no longer needed or supported based on the error
                    },
                },
              ],
         });
        const result = await model.generateContent(question);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error in AI API call:", error);
        throw error;
    }
}

module.exports = { run, run2, run3 };