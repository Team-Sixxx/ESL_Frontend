import React, { useEffect, useRef } from 'react';
import gantt from 'dhtmlx-gantt';
import "dhtmlx-gantt/codebase/skins/dhtmlxgantt_contrast_white.css";

const ganttChart = ({ tasks }) => {
  const ganttContainer = useRef(null);

  useEffect(() => {
    gantt.init(ganttContainer.current);
    gantt.parse(tasks);

    return () => {
      gantt.clearAll();
    };
  }, [tasks]);

  return (
    <div
      ref={ganttContainer}
      style={{ width: '100%', height: '500px' }}
    ></div>
  );
};

export default ganttChart;
