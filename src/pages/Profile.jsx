import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-2xl shadow p-5">
        <img
          src={user?.photoURL || 'https://i.pravatar.cc/120'}
          alt="profile"
          className="w-24 h-24 rounded-2xl object-cover mx-auto"
        />
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">{user?.displayName || 'No name'}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <p className="mt-3 text-sm break-all">UID: {user?.uid}</p>
        </div>
      </div>
    </div>
  );
}
