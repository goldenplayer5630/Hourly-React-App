import React from 'react';
import { WorkSessionResponse } from '../../classes/WorkSessionResponse';

type Props = {
  taskDescription: string;
  startTime: string;
  endTime: string;
  wbso: boolean;
  factor: number;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const WorkSessionCard: React.FC<Props> = ({ taskDescription, startTime, endTime, wbso, factor }) => {
  return (
    <div className="border rounded-xl shadow-md p-4 mb-4 bg-white">
      <h2 className="text-lg font-semibold mb-1">
        {taskDescription}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Time:</strong> {formatDate(startTime)} – {formatDate(endTime)}
      </p>
      <p className="text-sm mb-1">
        <strong>Factor:</strong> {factor}
      </p>
      {wbso && (
        <p className="text-sm text-blue-600 font-semibold">WBSO Registered</p>
      )}
    </div>
  );
};

export default WorkSessionCard;
