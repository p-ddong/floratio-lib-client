/* src/app/verify-email/page.tsx */
import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

export const dynamic = 'force-dynamic'; // bỏ SSG, chỉ SSR/CSR

export default function VerifyEmailPage() {
  return (
    <main className="flex items-center justify-center min-h-[60vh]">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyEmailClient />
      </Suspense>
    </main>
  );
}
