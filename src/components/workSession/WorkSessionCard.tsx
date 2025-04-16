import React from 'react';
import { WorkSessionResponse } from '../../classes/WorkSessionResponse';

type Props = {
  session: WorkSessionResponse;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const WorkSessionCard: React.FC<Props> = ({ session }) => {
  return (
    <div className="border rounded-xl shadow-md p-4 mb-4 bg-white">
      <h2 className="text-lg font-semibold mb-1">
        {session.taskDescription}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Time:</strong> {formatDate(session.startTime)} – {formatDate(session.endTime)}
      </p>
      <p className="text-sm mb-1">
        <strong>Factor:</strong> {session.factor}
      </p>
      {session.wbso && (
        <p className="text-sm text-blue-600 font-semibold">WBSO Registered</p>
      )}
      {session.otherRemarks && (
        <p className="text-sm italic text-gray-700 mt-2">
          <strong>Remarks:</strong> {session.otherRemarks}
        </p>
      )}
    </div>
  );
};

export default WorkSessionCard;
