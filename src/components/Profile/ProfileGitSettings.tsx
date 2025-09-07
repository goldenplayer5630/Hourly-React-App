import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  TextField,
  Button,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UpdateUserRequest } from '../../interfaces/Users/UpdateUserRequest';

type Props = {
  user: Pick<
    UpdateUserRequest,
    'id' | 'gitEmail' | 'gitUsername' | 'gitAccessToken'
  >;
  /** Called with the updated fields (partial UpdateUserRequest).
   *  Should throw on failure. Return value is ignored. */
  onSave: (payload: Pick<UpdateUserRequest, 'id' | 'gitEmail' | 'gitUsername' | 'gitAccessToken'>) => Promise<void>;
  title?: string;
};

const ProfileGitSettings: React.FC<Props> = ({ user, onSave, title = 'Git Settings' }) => {
  const [gitEmail, setGitEmail] = React.useState<string>(user.gitEmail ?? '');
  const [gitUsername, setGitUsername] = React.useState<string>(user.gitUsername ?? '');
  const [gitAccessToken, setGitAccessToken] = React.useState<string>(user.gitAccessToken ?? '');
  const [showToken, setShowToken] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Simple validators
  const emailValid = !gitEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gitEmail);
  const tokenTooShort = !!gitAccessToken && gitAccessToken.length < 8; // arbitrary sanity check

  const hasChanges =
    (gitEmail ?? '') !== (user.gitEmail ?? '') ||
    (gitUsername ?? '') !== (user.gitUsername ?? '') ||
    (gitAccessToken ?? '') !== (user.gitAccessToken ?? '');

  const handleClear = () => {
    setGitEmail('');
    setGitUsername('');
    setGitAccessToken('');
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!emailValid) {
      setError('Please enter a valid Git email address.');
      return;
    }
    if (tokenTooShort) {
      setError('Access token is too short.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        id: user.id,
        gitEmail: gitEmail || null,
        gitUsername: gitUsername || null,
        gitAccessToken: gitAccessToken || null,
      });
      setSuccess('Git settings saved.');
    } catch (e: any) {
      setError(e?.message || 'Failed to save Git settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        title={title}
        action={
          <Tooltip title="These credentials are used to link your commits.">
            <InfoOutlined sx={{ color: 'text.secondary' }} />
          </Tooltip>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Git Email"
            value={gitEmail}
            onChange={(e) => setGitEmail(e.target.value)}
            error={!emailValid}
            helperText={!emailValid ? 'Invalid email address' : ' '}
            placeholder="name@company.com"
            fullWidth
          />

          <TextField
            label="Git Username"
            value={gitUsername}
            onChange={(e) => setGitUsername(e.target.value)}
            placeholder="your-github-user"
            fullWidth
          />

          <TextField
            label="Git Access Token"
            type={showToken ? 'text' : 'password'}
            value={gitAccessToken}
            onChange={(e) => setGitAccessToken(e.target.value)}
            placeholder="••••••••"
            fullWidth
            helperText={gitAccessToken ? 'Keep this token secure.' : ' '}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showToken ? 'Hide token' : 'Show token'}
                    onClick={() => setShowToken((s) => !s)}
                    edge="end"
                  >
                    {showToken ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" gap={1} justifyContent="flex-end" mt={1}>
            <Button onClick={handleClear} disabled={saving || (!gitEmail && !gitUsername && !gitAccessToken)}>
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !hasChanges || !emailValid || tokenTooShort}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileGitSettings;
