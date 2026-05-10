import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, User as UserIcon, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login', { replace: true });
  };

  const recents: string[] = JSON.parse(localStorage.getItem('recent_searches') || '[]');

  return (
    <div className="min-h-screen sky-gradient p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
              <p className="text-sm text-muted-foreground">Account details</p>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
          {recents.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {recents.map((c) => (
                  <span key={c} className="px-3 py-1.5 bg-secondary/50 rounded-full text-sm text-foreground">{c}</span>
                ))}
              </div>
            </div>
          )}
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
