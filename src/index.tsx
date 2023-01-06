import React, { useState } from "react";
import { render } from "react-dom";
import { Group } from "@visx/group";
import { AreaStack } from "@visx/shape";
import { AxisLeft, AxisBottom } from "@visx/axis";

import { scaleTime, scaleLinear, scaleOrdinal } from "@visx/scale";
import * as allCurves from "@visx/curve";

export type TooltipProps = {
  width: number;
  height: number;
  showControls?: boolean;
};
type TooltipData = string;
const positionIndicatorSize = 8;
let data = [
  { date: "2012-04-23T04:00:00.000Z", Group1: 57, Group2: 12, Group3: 46 },
  { date: "2012-04-24T04:00:00.000Z", Group1: 32, Group2: 19, Group3: 42 },
  { date: "2012-04-25T04:00:00.000Z", Group1: 100, Group2: 16, Group3: 44 },
  { date: "2012-04-26T04:00:00.000Z", Group1: 24, Group2: 52, Group3: 11 }
];

const keys = ["Group1", "Group2", "Group3"];
const x = (d) => new Date(d.date);

const xScale = scaleTime({
  domain: [x(data[0]), x(data[3])]
});
const yScale = scaleLinear({
  domain: [0, 240]
});
const zScale = scaleOrdinal({
  range: ["#3182bd", "#6baed6", "#9ecae1"],
  domain: keys
});

const App = ({ width, height, margin, showControls }: TooltipProps) => {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);
  const [tooltipShouldDetectBounds, setTooltipShouldDetectBounds] = useState(
    true
  );
  const [renderTooltipInPortal, setRenderTooltipInPortal] = useState(false);

  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal(
    {
      scroll: true,
      detectBounds: tooltipShouldDetectBounds
    }
  );

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<TooltipData>({
    // initial tooltip state
    tooltipOpen: true,
    tooltipLeft: width / 3,
    tooltipTop: height / 3,
    tooltipData: "Move me with your mouse or finger"
  });

  return (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        <AreaStack
          curve={allCurves["curveNatural"]}
          keys={keys}
          data={data}
          stroke="white"
          strokeWidth={2}
          x={(d) => {
            console.log("x ", x(d.data));
            return xScale(x(d.data));
          }}
          y0={(d) => {
            console.log("y0 ", d[0]);
            return yScale(d[0]);
          }}
          y1={(d) => {
            console.log("y1", d[1] - 20);
            return yScale(d[1]);
          }}
          fill={(d) => zScale(keys[d.index])}
        >
          {({ stacks, path }) =>
            stacks.map((stack, i) => (
              <path
                key={`stack-${stack.key}`}
                d={path(stack) || ""}
                stroke="transparent"
                fill={zScale(keys[i])}
              />
            ))
          }
        </AreaStack>
        <AxisLeft scale={yScale} />
        <AxisBottom top={yMax} scale={xScale} />
      </Group>
    </svg>
  );
};

render(
  <App
    width={600}
    height={450}
    margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
  />,
  document.getElementById("root")
);
