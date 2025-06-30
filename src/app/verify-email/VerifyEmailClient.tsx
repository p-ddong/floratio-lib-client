/* src/app/verify-email/VerifyEmailClient.tsx */
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/services/axiosInstance';

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    axiosInstance
      .get('/auth/verify-email', { params: { token } }) // ⬅️ GỌI GET
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  /* ---------- UI ---------- */
  if (status === 'loading')
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin" />
        <p>Verifying your email…</p>
      </div>
    );

  if (status === 'success')
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-xl font-semibold text-green-600">
          Verification successful!
        </p>
        <Button onClick={() => router.push('/login')}>Login</Button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl font-semibold text-red-600">
        Token is invalid or expired.
      </p>
      <Button variant="secondary" onClick={() => router.push('/')}>
        Back to home page
      </Button>
    </div>
  );
}
