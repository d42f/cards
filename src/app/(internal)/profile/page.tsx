import { auth } from '@/auth';

export default async function ProfilePage() {
  const session = await auth();
  const { name, email, role } = session!.user;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-8 space-y-2 text-sm">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div>
        <span className="font-medium">Name: </span>
        {name ?? '—'}
      </div>
      <div>
        <span className="font-medium">Email: </span>
        {email ?? '—'}
      </div>
      <div>
        <span className="font-medium">Role: </span>
        <span className="capitalize">{role?.toLowerCase() ?? '—'}</span>
      </div>
    </div>
  );
}
