import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BasketballCourtChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const originalCourtWidth = 610;
    const originalCourtHeight = 696;

    const svgWidth = 610; 
    const svgHeight = 696; 

    const svg = d3.select(svgRef.current).attr('width', svgWidth).attr('height', svgHeight);

    svg
      .append('svg:image')
      .attr('xlink:href', '/src/assets/bball.png') 
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .attr('opacity', .6);

    const fixedZones = [
      { id: 'topOfKey', x: 500, y: 500, size: 20 },
      { id: 'rightCorner', x: 670, y: 600, size: 20 },
      { id: 'rightWingMid', x: 800, y: 700, size: 20 },
      { id: 'rightWingThree', x:900, y: 650, size: 20 },
      { id: 'leftCorner', x: 330, y: 600, size: 20 },
      { id: 'leftWingMid', x: 220, y: 700, size: 20 },
      { id: 'leftWingThree', x: 110, y: 650, size: 20 },
      { id: 'rightBaseline', x: 850, y: 900, size: 20 },
      { id: 'rightBaselineThree', x: 990, y: 900, size: 20 },
      { id: 'leftBaseline', x: 160, y: 900, size: 20 },
      { id: 'leftBaselineThree', x: 30, y: 900, size: 20 },
      { id: 'freeThrowLine', x: 500, y: 600, size: 20 },
    ];

    const mockData = [
      { zone: 'topOfKey', x: 100, y: 100, made: 1, attempts: 2 },
      { zone: 'rightCorner', x: (2 * svgWidth) / 3, y: (2 * svgHeight) / 3, made: 1, attempts: 3 },
      { zone: 'rightWingMid', x: (2 * svgWidth) / 3, y: (2 * svgHeight) / 3, made: 1, attempts: 3 },
      { zone: 'rightWingThree', x: (2 * svgWidth) / 3, y: (2 * svgHeight) / 3, made: 1, attempts: 3 },
      { zone: 'leftCorner', x: svgWidth / 3, y: (2 * svgHeight) / 3, made: 0, attempts: 2 },
      { zone: 'leftWingMid', x: svgWidth / 3, y: (2 * svgHeight) / 3, made: 0, attempts: 2 },
      { zone: 'leftWingThree', x: svgWidth / 3, y: (2 * svgHeight) / 3, made: 0, attempts: 2 },
      { zone: 'rightBaseline', x: (2 * svgWidth) / 3, y: svgHeight / 3, made: 2, attempts: 5 },
      { zone: 'rightBaselineThree', x: (2 * svgWidth) / 3, y: svgHeight / 3, made: 2, attempts: 5 },
      { zone: 'leftBaseline', x: svgWidth / 3, y: svgHeight / 3, made: 1, attempts: 3 },
      { zone: 'leftBaselineThree', x: svgWidth / 3, y: svgHeight / 3, made: 1, attempts: 3 },
      { zone: 'freeThrowLine', x: 500, y: 870, made: 0, attempts: 7 },
    ];

    svg
  .selectAll('rect')
  .data(fixedZones)
  .enter()
  .append('rect')
  .attr('x', (d) => `${(d.x / originalCourtWidth) * 350 - d.size / 2}px`)
  .attr('y', (d) => `${(d.y / originalCourtHeight) * 500 - d.size / 2}px`)
  .attr('width', (d) => `${(d.size / originalCourtWidth) * 1500}px`)
  .attr('height', (d) => `${(d.size / originalCourtHeight) * 1500}px`)
  .attr('fill', (d) => {
    const shot = mockData.find((item) => item.zone === d.id);
    if (shot) {
      const percentage = (shot.made / shot.attempts) * 100;
      if (percentage >= 50) return 'green';
      else if (percentage >= 30) return 'blue';
      else return 'red';
    }
    return 'red'; 
  })
  .attr('opacity', '2')

  svg
  .selectAll('text')
  .data(fixedZones)
  .enter()
  .append('text')
  .text((d) => {
    const shot = mockData.find((item) => item.zone === d.id);
    return shot ? `${shot.made}/${shot.attempts}` : '';
  })
  .attr('x', (d) => `${(d.x / originalCourtWidth) * 350}px`)
  .attr('y', (d) => `${(d.y / originalCourtHeight) * 500}px`)
  .attr('dy', '0.35em') 
  .attr('text-anchor', 'middle') 
  .attr('fill', 'white') 
  .style('font-size','bold', '12px');
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default BasketballCourtChart;
