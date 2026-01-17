"use client";

import { FaLongArrowAltRight } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { GiArrowCursor } from "react-icons/gi";
import { ACTIONS } from "./constant/constant";
import { IoMdDownload } from "react-icons/io";
import { FaRegCircle } from "react-icons/fa6";
import { TbRectangle } from "react-icons/tb";
import { LuPencil } from "react-icons/lu";
import { CiEraser } from "react-icons/ci";
import { v4 as uuid } from "uuid";
import Konva from "konva";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";

export default function Home() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const isPainting = useRef(false);
  const currentShapeId = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [action, setAction] = useState<string>(ACTIONS.SELECT);
  const [fillColor, setFillColor] = useState<string>("#ff0000");
  const [rectangles, setRectangles] = useState<Array<any>>([]);
  const [circles, setCircles] = useState<Array<any>>([]);
  const [arrows, setArrows] = useState<Array<any>>([]);
  const [scribbles, setScribbles] = useState<Array<any>>([]);

  const strokeColor: string = "#000000";

  const isDraggable: boolean = action === ACTIONS.SELECT;

  const handleSetAction = (newAction: string) => {
    setAction(newAction);
  };

  const handleClear = () => {
    setAction(ACTIONS.SELECT);
    setFillColor("#ff0000");
    setRectangles([]);
    setCircles([]);
    setArrows([]);
    setScribbles([]);
  };

  const handleSelect = (e: any) => {
    if (action !== ACTIONS.SELECT) return;

    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  };

  const handleDeselect = () => {
    transformerRef.current.nodes([]);
  };

  function onPointerDown(event: any) {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    if (!stage) return;

    const stagePos = stage.getPointerPosition();
    if (!stagePos) return;

    const { x, y } = stagePos;
    const id = uuid();

    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        const newRect = {
          id,
          x,
          y,
          width: 20,
          height: 20,
          fill: fillColor,
        };
        setRectangles([...rectangles, newRect]);
        break;
      case ACTIONS.CIRCLE:
        const newCircle = {
          id,
          x,
          y,
          radius: 20,
          fill: fillColor,
        };
        setCircles([...circles, newCircle]);
        break;
      case ACTIONS.ARROW:
        const newArrow = {
          id,
          points: [x, y, x + 20, y + 20],
          fill: fillColor,
        };
        setArrows([...arrows, newArrow]);
        break;
      case ACTIONS.SCRIBBLE:
        const newScribble = {
          id,
          points: [x, y],
          fill: fillColor,
        };
        setScribbles([...scribbles, newScribble]);
        break;
      default:
        break;
    }
  }
  function onPointerMove(event: any) {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    if (!stage) return;

    const stagePos = stage.getPointerPosition();
    if (!stagePos) return;

    const { x, y } = stagePos;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((prevRectangles) =>
          prevRectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((prevCircles) =>
          prevCircles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((prevArrows) =>
          prevArrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((prevScribbles) =>
          prevScribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
      default:
        break;
    }
  }

  function onPointerUp(event: any) {
    isPainting.current = false;
  }

  function handleExport() {
    const uri = stageRef.current?.toDataURL();
    if (!uri) return;

    var link = document.createElement("a");
    link.download = "canvas.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* controls */}
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border-none shadow-lg rounded-lg">
          <button
            className={`p-2 border-none rounded cursor-pointer bg-white text-black`}
            onClick={() => handleClear()}
          >
            <CiEraser className="w-6 h-6" />
          </button>
          <button
            className={`p-2 border-none rounded cursor-pointer ${
              action === ACTIONS.SELECT
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleSetAction(ACTIONS.SELECT)}
          >
            <GiArrowCursor className="w-6 h-6" />
          </button>
          <button
            className={`p-2 border-none rounded cursor-pointer ${
              action === ACTIONS.RECTANGLE
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleSetAction(ACTIONS.RECTANGLE)}
          >
            <TbRectangle className="w-6 h-6" />
          </button>
          <button
            className={`p-2 border-none rounded cursor-pointer ${
              action === ACTIONS.CIRCLE
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleSetAction(ACTIONS.CIRCLE)}
          >
            <FaRegCircle className="w-6 h-6" />
          </button>
          <button
            className={`p-2 border-none rounded cursor-pointer  ${
              action === ACTIONS.ARROW
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleSetAction(ACTIONS.ARROW)}
          >
            <FaLongArrowAltRight className="w-6 h-6" />
          </button>
          <button
            className={`p-2 border-none rounded cursor-pointer  ${
              action === ACTIONS.SCRIBBLE
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleSetAction(ACTIONS.SCRIBBLE)}
          >
            <LuPencil className="w-6 h-6" />
          </button>

          <button>
            <input
              className="w-6 h-6 rounded-lg"
              type="color"
              value={fillColor}
              onChange={(event) => setFillColor(event.target.value)}
            />
          </button>

          <button
            className={`p-2 border-none rounded cursor-pointer`}
            onClick={handleExport}
          >
            <IoMdDownload className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Canvas */}
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <Layer>
          {/* 1. Close the Background Rect immediately (make it self-closing) */}
          <Rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth={2}
            id="bg"
            onClick={handleDeselect}
          />

          {/* 2. Map the rectangles as siblings inside the Layer */}
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              stroke={strokeColor}
              strokeWidth={2}
              draggable={isDraggable}
              onClick={(e) => handleSelect(e)}
            />
          ))}

          {circles.map((circ) => (
            <Circle
              key={circ.id}
              radius={circ.radius}
              x={circ.x}
              y={circ.y}
              fill={circ.fill}
              stroke={strokeColor}
              strokeWidth={2}
              draggable={isDraggable}
              onClick={(e) => handleSelect(e)}
            />
          ))}

          {arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              points={arrow.points}
              fill={arrow.fill}
              stroke={strokeColor}
              strokeWidth={2}
              draggable={isDraggable}
              onClick={(e) => handleSelect(e)}
            />
          ))}

          {scribbles.map((scribble) => (
            <Line
              lineCap="round"
              lineJoin="round"
              key={scribble.id}
              points={scribble.points}
              fill={scribble.fill}
              stroke={strokeColor}
              strokeWidth={2}
              draggable={isDraggable}
              onClick={(e) => handleSelect(e)}
            />
          ))}

          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}
