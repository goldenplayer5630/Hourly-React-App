import { useEffect, useState } from 'react';
import { UserContractResponse } from '../interfaces/UserContracts/UserContractResponse';
import { UserResponse } from '../interfaces/Users/UserResponse';
import { userContractService } from '../services/UserContractService';
import { userService } from '../services/UserService';
import UserContractHeader from '../components/UserContract/UserContractHeader';
import UserContractList from '../components/UserContract/UserContractList';
import UserContractModal from '../components/UserContract/UserContractModal';
import Notification, { NotificationState } from '../components/Common/Notification';

const UserContractsPage = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [userContracts, setUserContracts] = useState<UserContractResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedUserContract,  setSelectedUserContract] = useState<UserContractResponse | undefined>();
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    
    const handleAddUserContract = () => {
        setModalMode('create');
        setSelectedUserContract(undefined);
        setOpenModal(true);
    };

        const handleEditUserContract = (userContract: UserContractResponse) => {
        setModalMode('edit');
        setSelectedUserContract(userContract);
        setOpenModal(true);
    };

        const handleViewUserContract = (userContract: UserContractResponse) => {
        setModalMode('view');
        setSelectedUserContract(userContract);
        setOpenModal(true);
    };

    const handleDeleteUserContract = (userContract: UserContractResponse) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
        userContractService.delete(userContract.id)
            .then(() => {
            setUserContracts((prev) => prev.filter((s) => s.id !== userContract.id));
            })
            .catch((err) => {setNotification({ message: 'Error deleting user contract', severity: 'error' })});
        }
    };

    const refreshUserContract = () => {
        if (!selectedUser) return;

        userContractService
            .filter(selectedUser, undefined, undefined)
            .then(setUserContracts)
            .catch((err) => {setNotification({ message: 'Error fetching user contracts', severity: 'error' })});
    };
    
    useEffect(() => {
    userService.getAll()
        .then(setUsers)
        .catch((err) => setNotification({ message: 'Error fetching users', severity: 'error' }));

    }, []);

    useEffect(() => {
    if (!selectedUser) return;

    userContractService.filter(selectedUser, undefined, undefined)
        .then(setUserContracts)
        .catch((err) => setNotification({ message: 'Error fetching user contracts', severity: 'error' }));

    }, [selectedUser]);

    useEffect(() => {
        refreshUserContract();
    }, [selectedUser]);

      
    return (
        <div>
        <h1>Contracts</h1>
        <UserContractHeader
            selectedUser={selectedUser}
            onUserChange={setSelectedUser}
            onAddUserContract={handleAddUserContract}
            users={users}
            />

        <UserContractList
            userContracts={userContracts}
            onView={selectedUserContract => handleViewUserContract(selectedUserContract)}
            onEdit={selectedUserContract => handleEditUserContract(selectedUserContract)}
            onDelete={selectedUserContract => handleDeleteUserContract(selectedUserContract)}
        />

        <UserContractModal
            open={openModal}
            mode={modalMode}
            selectedUserContract={selectedUserContract}
            selectedUser={selectedUser}
            onClose={() => setOpenModal(false)}
            onSubmit={() => {
                setOpenModal(false);
                refreshUserContract();
            }}
            />

        <Notification notification={notification} onClose={() => setNotification(null)} />
        </div>
    );
}

export default UserContractsPage;