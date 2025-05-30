import React from 'react';
import UserContractCard from './UserContractCard';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse'; // or wherever your model is

type Props = {
  userContracts: UserContractResponse[];
  onView: (userContract: UserContractResponse) => void;
  onEdit: (userContract: UserContractResponse) => void;
  onDelete: (userContract: UserContractResponse) => void;
};


const UserContractList: React.FC<Props> = ({ userContracts, onView, onEdit, onDelete }) => {
  if (!userContracts.length) return <p>No contracts available.</p>;

  return (
    <div>
      {userContracts.map((userContract) => (
        <UserContractCard
          key={userContract.id}
          userContract={userContract}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default UserContractList;
