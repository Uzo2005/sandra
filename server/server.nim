import std/[oids, strformat, os, json, httpclient]
import pkg/[prologue, prologue/middlewares/cors, openaiClient]

const
    allowedClientDomains = @["http://localhost:4321", "https://cletusigwe.com"]
    baseConversation =
        """{
                "model": "gpt-4o-mini",
                "messages":[
                    {"role": "system", "content": "You are Sandra, a warm and approachable travel assistant chatbot designed to help users plan their vacations. You should focus on understanding the user’s preferences and providing thoughtful suggestions, itineraries, and advice based on their input. You are knowledgeable about various travel destinations and should offer personalized recommendations. You should always maintain a positive, helpful, and engaging tone. Users dont have much time and so your answers should be concise."},
                    {"role": "assistant", "content": "Hi! I'm Sandra, your personal vacation planner. 😊 If you have some vacation days but aren't sure how to use them, I'm here to help you plan the perfect getaway! Let's make sure you take those well-deserved breaks. How many days off are we working with?"},
                ]
            }
        """

var app = newApp()

func addUserMessage(chatState: var JsonNode, message: string) =
    chatState["messages"].add(%*{"role": "user", "content": message})

func addAssistantMessage(chatState: var JsonNode, message: string) =
    chatState["messages"].add(%*{"role": "assistant", "content": message})

proc sendHomePage(ctx: Context) {.async, gcsafe.} =
    resp "webserver for sandra the travel chatbot."

proc startNewChat(ctx: Context) {.async, gcsafe.} =
    let chatId = $genOid()
    resp chatId

proc chat(ctx: Context) {.async, gcsafe.} =
    let
        chatId = ctx.getPathParams("chatId")
        chatFileBucket = fmt"chats/{chatId}.json"

    case ctx.request.reqMethod
    of HttpGET:
        if (fileExists(chatFileBucket)):
            let
                chatState = parseJson(readFile(chatFileBucket))
                messages = newJArray()

            #remove system prompt
            messages.elems = chatState["messages"].getElems[1 ..^ 1]

            resp $messages
        else:
            let
                chatState = parseJson(baseConversation)
                messages = newJArray()

            #remove system prompt
            messages.elems = chatState["messages"].getElems[1 ..^ 1]

            resp $messages
    of HttpPOST:
        try:
            if (chatId.len > 0):
                var chatState: JsonNode
                if (fileExists(chatFileBucket)):
                    chatState = parseJson(readFile(chatFileBucket))
                else:
                    chatState = parseJson(baseConversation)
                let message = parseJson(ctx.request.body())["message"].getStr

                chatState.addUserMessage(message)

                let
                    env = loadEnvFile(".env")
                    api_key = env.get("OPENAI_KEY")
                    openai = newAsyncOpenAiClient(api_key = api_key)
                    openAiResponse = await openai.createChatCompletion(chatState)
                    openAiResponseJson = parseJson(await openAiResponse.body())

                if openAiResponseJson.hasKey("choices") and
                        openAiResponseJson["choices"].len > 0:
                    if openAiResponseJson["choices"][0]["finish_reason"] == %"stop":
                        let botAnswer =
                            openAiResponseJson["choices"][0]["message"]["content"].getStr
                        chatState.addAssistantMessage(botAnswer)
                        resp botAnswer
                    else:
                        resp "Hi, I cannot answer this type of question 🤔"
                else:
                    resp "[sandra's secretary here]: sandra is busy and will respond to you later 😊"

                chatFileBucket.writeFile($chatState) #backup chat for later use

                # resp "Great! With 6 weeks of vacation, you have plenty of options. Would you prefer spreading out your days for multiple shorter trips, or are you thinking of taking a longer getaway? I can help you plan both! 😎✈️"
            else:
                resp "Invalid ChatId, refresh the page and try again"
        except Exception as e:
            echo e.msg
            resp "Sandra loves you, but unfortunately an error occured in her server, refresh the page and try again"
    else:
        resp "Invalid Method For This Route"

app.use(
    CorsMiddleware(
        allowOrigins = allowedClientDomains,
        allowMethods = @["GET", "POST"],
        allowHeaders = @["*"],
    )
)
app.get("/", sendHomePage)
app.get("/startNewChat", startNewChat)
app.addRoute("/chat/{chatId}", chat, [HttpGet, HttpPost])
app.run()
