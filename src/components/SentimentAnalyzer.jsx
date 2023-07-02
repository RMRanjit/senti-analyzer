import { useState } from "react";
import PropTypes from "prop-types";

/*Material ui imports */
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import {
  Avatar,
  CardActionArea,
  Grid,
  IconButton,
  Stack,
  Box,
  Icon,
  Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { indigo, purple, blue } from "@mui/material/colors";

//Icons
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import WebAssetSharpIcon from "@mui/icons-material/WebAssetSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

/*Project Imports */

import { SpeechTranscriber } from "./SpeechTranscriber";
import { AudioAnalyserProvider } from "../contexts/AudioAnalyserContext";
import { InputAudioProvider } from "../contexts/InputAudioContext";
import { MediaStreamProvider } from "../contexts/MediaStreamContext";

/* Few issues noticed are
1. if the user presses 'reset', the call status toggles
2. if the user continues to press reset in between calls, the reset works only the first time. that is becase the "Action" state does not change and propagate a change on the child component
3. the transscript component keeps growing in size as we continue speaking
*/

const SentimentAnalyzer = (props) => {
  const [action, setAction] = useState("stop");
  const handleCall = () => {
    // toggle the action
    setAction(action === "stop" ? "start" : "stop");
  };

  return (
    <Card
      sx={{
        maxWidth: "650px",
        maxHeight: "500px",
        margin: "5px",
        boxShadow: "0 23px 33px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          //margin: "0 15px 0 30px",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            // background: "yellow",
          }}
        >
          <Grid
            item
            sx={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              //useFlexGap={true}
              //justifyItems="space-around"
              alignItems="center"
            >
              <Avatar
                sx={{ bgcolor: indigo[500], width: 30, height: 30 }}
                aria-label="Call"
              >
                <CallOutlinedIcon fontSize="small" />
              </Avatar>
              <Typography
                sx={{
                  display: "inline",
                  marginLeft: "100px",
                  fontSize: "21px",
                  fontWeight: 900,
                  minWidth: "100px",
                  textAlign: "left",
                }}
              >
                Active call
              </Typography>
              <Typography
                sx={{
                  margin: "5px 15px 0 15px",
                  fontSize: "15px",
                  fontWeight: 300,
                  letterSpacing: "0.85px",
                  minWidth: "350px",
                  textAlign: "left",
                }}
              >
                (000) 000-0000
              </Typography>
              <Typography
                sx={{
                  width: "31",
                  height: "18",
                  flexGrow: 0,
                  fontSize: "15px",
                  fontWeight: 500,
                  letterSpacing: "0.61px",
                  marginRight: "20",
                  marginLeft: "50",
                  color: "#9a9a9a",
                }}
              >
                4.26
              </Typography>
              <Box
                sx={{
                  width: "31",
                  height: "18",
                  flexGrow: 0,
                  fontSize: "15px",
                  fontWeight: 500,
                  letterSpacing: "0.61px",
                  marginRight: "20",
                  marginLeft: "50",
                  color: "#9a9a9a",
                }}
              >
                {action === "start" ? (
                  <MicOutlinedIcon fontSize="small" color="success" />
                ) : (
                  <KeyboardVoiceOutlinedIcon fontSize="small" />
                )}
              </Box>
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "5px",
              borderRadius: "50px",
              backgroundColor: "#e7eef7",
              paddingLeft: "30px",
              paddingRight: "30px",
              //padding: "21px 33px 21.2px 27.5px",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                size="small"
                startIcon={<CallOutlinedIcon />}
                onClick={handleCall}
              >
                {action == "stop" ? "Answer" : "End Call"}
              </Button>
              <Button size="small" startIcon={<VolumeOffOutlinedIcon />}>
                Mute
              </Button>
              <Button size="small" startIcon={<PersonAddOutlinedIcon />}>
                Hold
              </Button>
              <Button
                size="small"
                startIcon={<WebAssetSharpIcon />}
                onClick={() => setAction("reset")}
              >
                Reset
              </Button>
              <Button size="small" startIcon={<VideocamOutlinedIcon />}>
                Video Call
              </Button>
            </Stack>
          </Grid>

          <Grid
            item
            sx={{
              display: "flex",
              marginTop: "5px",
              marginLeft: "5px",
            }}
          >
            <MediaStreamProvider video={false} audio={true}>
              <InputAudioProvider>
                <AudioAnalyserProvider>
                  <SpeechTranscriber action={action} />
                </AudioAnalyserProvider>
              </InputAudioProvider>
            </MediaStreamProvider>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

SentimentAnalyzer.propTypes = {};

export default SentimentAnalyzer;
