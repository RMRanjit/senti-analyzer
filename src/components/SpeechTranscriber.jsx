import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Sentiment from "sentiment";
import AudioVisualiser from "./AudioVisualizer";
import { useMediaStream } from "../contexts/MediaStreamContext";

import { Box, Typography, Stack, Grid, Chip } from "@mui/material";

export const SpeechTranscriber = ({ action = "" }) => {
  const [message, messageSet] = useState("");
  const { stream, start, stop } = useMediaStream();
  const [sentimentScore, setSentimentScore] = useState(null);
  const sentiment = new Sentiment();
  const [messageArray, setMessageArray] = useState([]);

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    commands: [
      {
        command: "reset",
        callback: () => resetTranscript(),
      },
      {
        command: "shut up",
        callback: () => messageSet("I wasn't talking."),
      },
      {
        command: "Hello",
        callback: () => messageSet("Hi there!"),
      },
    ],
  });

  useEffect(() => {
    if (finalTranscript !== "") {
      setSentimentScore(sentiment.analyze(finalTranscript));
      if (messageArray.length === 0) {
        setMessageArray([finalTranscript]);
      } else {
        console.log("Else Condition");
        // Get the last Message from the Array
        const lastMessage = messageArray[messageArray.length - 1];
        // get the start index of the last message on the final transcript
        const index = finalTranscript.indexOf(lastMessage);
        console.log("Last message was found at", index);
        const messageTobeAdded = finalTranscript.substring(
          index + lastMessage.length,
          finalTranscript.length
        );
        console.log(
          "Last Message",
          lastMessage,
          "Messge to be added",
          messageTobeAdded
        );
        if (messageTobeAdded.trim() !== "")
          setMessageArray([...messageArray, messageTobeAdded]);
      }
    }
    // if (interimTranscript !== "") {
    //   console.log(
    //     "Interim Transscript",
    //     interimTranscript,
    //     "-",
    //     finalTranscript
    //   );

    // // the pattern for a break is when we have finalTranscript and no interim Transcript,
    // // there is a pause detected. Using this pattern to create a message set.
    // if (finalTranscript !== "" && interimTranscript === "") {
    //   setMessageArray([...messageArray, finalTranscript]);
    // }
    //}
  }, [interimTranscript, finalTranscript]);

  let positiveWords = sentimentScore && [...new Set(sentimentScore.positive)];
  let negativeWords = sentimentScore && [...new Set(sentimentScore.negative)];

  useEffect(() => {
    switch (action) {
      case "reset":
        reset();
        // Clear the transscripts and the messages
        setMessageArray([]);
        break;
      case "start":
        startListening();
        break;
      case "stop":
        stopListening();
        break;
      default:
        break;
    }
  }, [action]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
    );

    return null;
  }

  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en",
    });
    stream ? start() : stop();
  };

  const reset = () => {
    resetTranscript();
  };
  const startListening = () => {
    listenContinuously();
    start();
  };
  const stopListening = () => {
    SpeechRecognition.stopListening();
    stop();
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{ display: "flex", flex: 1, minHeight: "200px" }}
      direction="row"
    >
      <Grid item xs={8} md={8} lg={10}>
        <Stack direction="row" spacing={2} alignItems="center">
          <img
            src="/images/AI_Image@3x.png"
            alt="some cool looking image"
            style={{ width: 20, height: 20 }}
          />
          <Typography
            sx={{
              margin: "-5px 15px 0 15px",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "4px",
              //color: blue[900],
              textTransform: "uppercase",
            }}
            component="div"
          >
            Cognition AI
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Stack direction="column">
            <Typography
              variant="body2"
              sx={{
                textAlign: "left",
                fontSize: "10px",
                fontWeight: 300,
                letterSpacing: "2px",
                wrap: true,
                marginTop: "10px",
              }}
            >
              Overall Sentiment Score:
            </Typography>
            <Typography
              style={{ textAlign: "left", fontSize: "15px", fontWeight: 700 }}
            >
              {sentimentScore ? sentimentScore.score : 0}
            </Typography>
          </Stack>
          <Box style={{ flex: 1, marginTop: -30 }}>
            <AudioVisualiser />
          </Box>
        </Stack>
        <Box justifyContent="flex-start">
          {sentimentScore &&
            positiveWords.map((word, index) => (
              <Chip
                key={word + "-" + index}
                label={word.toUpperCase()}
                color="success"
                variant="outlined"
                size="small"
                sx={{ marginRight: "2px", fontSize: "10px" }}
              />
            ))}
          {sentimentScore &&
            negativeWords.map((word, index) => (
              <Chip
                key={word + "-" + index}
                label={word.toUpperCase()}
                color="error"
                variant="outlined"
                size="small"
                sx={{ marginRight: "2px", fontSize: "10px" }}
              />
            ))}
        </Box>
      </Grid>
      <Grid item xs={4} md={4} lg={4}>
        <Stack>
          <Typography
            sx={{
              margin: "-5px 15px 0 15px",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "4px",
              //color: blue[900],
              textTransform: "uppercase",
            }}
            component="span"
          >
            Transcript
          </Typography>
          <Box
            style={{
              overflow: "auto",
              height: "175px",
              textAlign: "left",
              fontSize: "10px",
            }}
          >
            {/* {transcript} */}
            <Stack>
              {messageArray &&
                messageArray.map((word, index) => (
                  <div
                    style={{
                      float: "left",
                      padding: "5px 10px",
                      margin: "3px",
                      borderRadius: "1px 10px 10px 10px",
                      background: "#BCD4E6",
                      color: "black",
                      //minWidth: "40px",
                    }}
                  >
                    {word}
                  </div>
                ))}
            </Stack>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};
