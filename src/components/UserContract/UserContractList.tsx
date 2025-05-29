import React from 'react';
import UserContractCard from './UserContractCard';
import { UserContractResponse } from '../../interfaces/UserContracts/UserContractResponse'; // or wherever your model is

type Props = {
  contracts: UserContractResponse[];
  onView: (contract: UserContractResponse) => void;
  onEdit: (contract: UserContractResponse) => void;
  onDelete: (contract: UserContractResponse) => void;
};


const ContractList: React.FC<Props> = ({ contracts, onView, onEdit, onDelete }) => {
  if (!contracts.length) return <p>No contracts available.</p>;

  return (
    <div>
      {contracts.map((contract) => (
        <UserContractCard
          key={contract.id}
          contract={contract}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ContractList;
