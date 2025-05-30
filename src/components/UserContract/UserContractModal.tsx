import React  from "react";
import ContractType from "../../enums/ContractType";
import { WorkSessionResponse } from "../../interfaces/WorkSessions/WorkSessionResponse";
import { UserResponse } from "../../interfaces/Users/UserResponse";
import { UserContractResponse } from "../../interfaces/UserContracts/UserContractResponse";

type UserContractModalMode = 'create' | 'edit' | 'view';
type TvtMode = 'none' | 'accrue' | 'use';

type Props = {
  open: boolean;
  mode: UserContractModalMode;
  selectedUserContract?: UserContractResponse;
  selectedUser: string;
  onClose: () => void;
  onSubmit: () => void;
}

const UserContractModal: React.FC<Props> = () => {
  return (
    <div>
      <h2>User Contract Modal</h2>
      <p>This is a placeholder for the user contract modal content.</p>
    </div>
  );
};

export default UserContractModal;