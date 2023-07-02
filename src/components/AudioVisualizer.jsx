import React, { createRef, FunctionComponent, useEffect } from "react";
import { useAudioAnalyser } from "../contexts/AudioAnalyserContext";

const AudioVisualiser = ({ height = "100", width = "100" }) => {
  const canvasRef = createRef();
  const { analyser } = useAudioAnalyser();

  useEffect(() => {
    if (!analyser) {
      return;
    }

    let raf;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(data);
      const canvas = canvasRef.current;
      if (canvas) {
        const { height, width } = canvas;
        const context = canvas.getContext("2d");
        let x = 0;
        const sliceWidth = (width * 1) / data.length;

        if (context) {
          context.lineWidth = 0.5;
          //context.strokeStyle = "#fff";
          context.strokeStyle = "#004F98"; //"#03AC1D";
          context.clearRect(0, 0, width, height);

          context.beginPath();
          context.moveTo(0, height / 2);
          for (const item of data) {
            const y = (item / 255.0) * height;
            context.lineTo(x, y);
            x += sliceWidth;
          }
          context.lineTo(x, height / 2);
          context.stroke();
        }
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [canvasRef, analyser]);

  return analyser ? <canvas width="200" height="100" ref={canvasRef} /> : null;
};

export default AudioVisualiser;
