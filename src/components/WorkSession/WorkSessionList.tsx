import React from 'react';
import WorkSessionCard from './WorkSessionCard';
import { WorkSessionResponse } from '../../interfaces/WorkSessions/WorkSessionResponse'; // or wherever your model is
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse';

type Props = {
  sessions: WorkSessionResponse[];
  selectedUserContract: UserContractResponse;
  onView: (session: WorkSessionResponse) => void;
  onEdit: (session: WorkSessionResponse) => void;
  onDelete: (session: WorkSessionResponse) => void;
};


const WorkSessionList: React.FC<Props> = ({ sessions, selectedUserContract, onView, onEdit, onDelete }) => {
  if (!sessions.length) return <p>No sessions available.</p>;

  return (
    <div>
      {sessions.map((session) => (
        <WorkSessionCard
          key={session.id}
          session={session}
          userContract={selectedUserContract}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WorkSessionList;
