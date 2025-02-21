import React from "react";
import Sketch from "react-p5";
import "./ft.css";

const FractalTree = () => {
  let angle = 0; 
  let len = 60;

  const setup = (p5, canvasParentRef) => {
    // Remove any existing canvas to prevent duplicates
    if (canvasParentRef.children.length > 0) {
      canvasParentRef.removeChild(canvasParentRef.children[0]);
    }

    let canvas = p5.createCanvas(200, 200).parent(canvasParentRef);
    canvas.style("background", "transparent"); // Make background transparent
    p5.frameRate(30);
  };

  const draw = (p5) => {
    p5.clear(); // Clears previous frame to prevent ghosting effect
    p5.translate(100, 180); // Move origin to bottom center
    drawBranch(p5, len, angle);
    
    angle += 0.02; // This makes it move!
  };

  const drawBranch = (p5, len, angle) => {
    p5.stroke(200, 100, 150);
    p5.strokeWeight(2);
    p5.line(0, 0, 0, -len);
    p5.translate(0, -len);

    if (len > 10) {
      p5.push();
      p5.rotate(angle);
      drawBranch(p5, len * 0.7, angle);
      p5.pop();

      p5.push();
      p5.rotate(-angle);
      drawBranch(p5, len * 0.7, angle);
      p5.pop();
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default FractalTree;
