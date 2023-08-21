const chatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "";



const createChatLi = (message, className) => {
    //Create a chat <li> element with passed message and class name 
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing"
    ? `<p>${message}</p>`
    : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;

}

const generateResponse = (incomingChatli) => {
    // Generate a random response from the bot
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatli.querySelector("p");

    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: userMessage
                }
            ]
        })
    };
// Send POST request to API, get response and set the response as paragraph text
fetch(API_URL, requestOptions)
.then(res => res.json())
.then(data => {
    messageElement.textContent = data.choices[0].message.content.trim();
})
.catch(() => {
    messageElement.classList.add("error");
    messageElement.textContent = "Oops! Something went wrong. Please try again.";
})
.finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};
 

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append the user's message to the chatbox
    const outgoingChatli = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChatli);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatli = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatli);
        generateResponse(incomingChatli);
    }, 600);
};

sendChatbtn.addEventListener("click", handleChat);

