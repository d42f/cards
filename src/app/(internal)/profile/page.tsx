import { auth } from '@/auth';

export default async function ProfilePage() {
  const session = await auth();
  const { name, email, role } = session!.user;

  return (
    <div className="w-full max-w-md space-y-2 rounded-xl bg-white p-8 text-sm shadow">
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>
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
