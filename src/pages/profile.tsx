import React from 'react';
import ProfileCard from '../components/Profile/ProfileCard';
import ProfileGitSettings from '../components/Profile/ProfileGitSettings';
import { userService } from '../services/UserService'; // adjust path
import { UserResponse } from '../interfaces/Users/UserResponse';

export default function ProfilePage() {
  const [me, setMe] = React.useState<UserResponse | null>(null);

  React.useEffect(() => {
    if (me) return; // already loaded
  
    userService
      .getAll()
      .then((users) => {
        if (users && users.length > 0) {
          setMe(users[0]); // 👈 grab the first one
        } else {
          setMe(null);
        }
      })
      .catch(() => setMe(null));
  }, [me]);

  if (!me) return null;

  return (
    <div>
      <h1>Profile</h1>

      <ProfileCard user={me} />

      <div style={{ height: 16 }} />

      <ProfileGitSettings
        user={me}
        onSave={async (payload) => {
          // call your backend to update the current user's git settings
          const updated = await userService.update(me.id, payload); // must accept id + git fields
          setMe((prev: any) => ({ ...prev, ...updated }));   // reflect changes locally
        }}
      />
    </div>
  );
}
