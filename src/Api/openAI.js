// import axios from "axios";
// export const apiKey='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'

// const client = axios.create({
//     headers: {
//         "Authorization": 'Bearer ' + apiKey,
//         "Content-Type": "application/json",
//     },
// });

// const chatGPTEndpoint = "https://api.openai.com/v1/chat/completions";
// const dallEEndpoint = "https://api.openai.com/v1/images/generations";

// export const apiCall= async (prompt,messages) => {
//     try {
//         const response = await client.post(chatGPTEndpoint, {
//             model:'gpt-4o-mini',
//             messages:[
//                 {
//                     role:'user',
//                     content: `Does this message want to generate an AI picture, image, art or anything similar? ${prompt}. Simply answer "yes" or "no".`
//                 }
//             ]
//         });
//         console.log('data:',response.data.choices[0].message);
//         let isArt= response.data.choices[0].message.content;
//         if(isArt.toLowerCase().includes('yes')){
//             return dallEApiCall(prompt,messages);
//         }
//         else{
//             return chatGptApiCall(prompt,messages);
            
//         } 
//     } catch (error) {
//         console.log(error);
//         console.log(error.response.data); 
//         return Promise.resolve({success: false, messages: error.message});
//     }
// }

// const chatGptApiCall= async (prompt,messages) => {
//     try {
//         const response = await client.post(chatGPTEndpoint, {
//             model:'gpt-4o-mini',
//             messages: messages,
//         });

//         let answer= response.data.choices[0].message.content;
//         console.log('answer:',answer);
//         messages.push({ role:'assistant',content: answer.trim()});
//         return Promise.resolve({success: true, data: messages});
//     }
//     catch (error) {
//         console.log(error);
//         console.log(error.response.data); 
//         return Promise.resolve({success: false, messages: error.message});
//     }
// }

// const dallEApiCall= async (prompt,message) => {
//     try {
//         const response = await client.post(dallEEndpoint, {
//             model:'dall-e-3',
//             n:1,
//             prompt: prompt,
//             size:"1024x1024"
//         });
//         let url= response?.data?.data[0]?.url;
//         console.log('url:',url);
//         message.push({ role:'assistant',content: url});
//         return Promise.resolve({success: true, data: messages});
//     } catch (error) {
//         console.log(error);
//         console.log(error.response.data); 
//         return Promise.resolve({success: false, messages: error.message});
//     }
// }

import axios from "axios";
import { apiKey } from "../Constants/dummyMessages";

const client = axios.create({
    headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
    },
});

const chatGPTEndpoint = "https://api.openai.com/v1/chat/completions";
const dallEEndpoint = "https://api.openai.com/v1/images/generations";

// Main API call
export const apiCall = async (prompt, messages) => {
    try {
        const response = await client.post(chatGPTEndpoint, {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `Does this message want to generate or creat an picture or image or art, or anything similar? ${prompt}. Simply answer "yes" or "no".`,
                },
            ],
        });
        let isArt = response?.data?.choices[0]?.message?.content;
        console.log("Is Art:", isArt);
        // Determine whether to call DALL·E or ChatGPT
        if (isArt.toLowerCase().includes("yes")) {
            console.log("Calling DALL·E API");
            return dallEApiCall(prompt, messages || []);
        } else {
            console.log("Calling ChatGPT API");
            return chatGptApiCall(prompt, messages || []);
        }
    } catch (error) {
        console.error("Error main:", error.response?.data || error.message);
        return Promise.resolve({ success: false, messages: error.message });
    }
};

// ChatGPT API call
const chatGptApiCall = async (prompt, messages) => {
    try {
        const response = await client.post(chatGPTEndpoint, {
            model: "gpt-4o-mini",
            messages: messages,
        });

        let answer = response.data?.choices[0]?.message?.content;

        // Add assistant's response to the conversation
        messages.push({ role: "assistant", content: answer.trim() });
        return Promise.resolve({ success: true, data: messages });
    } catch (error) {
        console.error("Error GPT:", error.response?.data || error.message);
        return Promise.resolve({ success: false, messages: error.message });
    }
};

// DALL·E API call
const dallEApiCall = async (prompt, messages) => {
    try {
        const response = await client.post(dallEEndpoint, {
            prompt: prompt,
            n: 1, // Number of images to generate
            size: "1024x1024",
            model: 'dall-e-2',
        });

        let url = response?.data?.data[0]?.url;
        console.log("Generated Image URL:", url);

        // Add DALL·E image URL to the conversation
        messages.push({ role: "assistant", content: url });
        return Promise.resolve({ success: true, data: messages });
    } catch (error) {
        console.error("Error BALL-E:", error.response?.data || error.message);
        return Promise.resolve({ success: false, messages: error.message });
    }
};


