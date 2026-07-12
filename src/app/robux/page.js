export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'Free Robux',
};

export default async function RobuxPage() {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) redirect('/login');

  const user = (await query('SELECT robux, last_daily_claim FROM users WHERE id = $1', [userId])).rows[0];

  // Check if today's claim has already been made
  const lastClaim = user.last_daily_claim ? new Date(user.last_daily_claim).toDateString() : null;
  const today = new Date().toDateString();
  const canClaim = lastClaim !== today;

  async function claimRobux() {
    'use server';
    const userId = (await cookies()).get('userId').value;
    
    // Double check claim status on server side
    const currentUser = (await query('SELECT last_daily_claim FROM users WHERE id = $1', [userId])).rows[0];
    const lastClaimServer = currentUser.last_daily_claim ? new Date(currentUser.last_daily_claim).toDateString() : null;
    
    if (lastClaimServer !== new Date().toDateString()) {
      await query(
        'UPDATE users SET robux = robux + 100, last_daily_claim = CURRENT_TIMESTAMP WHERE id = $1', 
        [userId]
      );
      revalidatePath('/robux');
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', color: '#F2F3F5', fontFamily: '"HCo Gotham SSm", Arial, sans-serif' }}>
      <h1>Premium & Robux</h1>
      <p style={{ color: '#B5BAC1' }}>You are currently on Ziptrii Premium (Free). Claim your daily stipend below.</p>
      
      {/* Balance Card */}
      <div style={{ background: '#1E1F22', padding: '20px', borderRadius: '8px', border: '1px solid #313338', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '18px' }}>Balance</span>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#00A2FF' }}>{user?.robux || 0} R$</span>
      </div>

      {/* Claim Button */}
      <form action={claimRobux}>
        <button 
          type="submit" 
          disabled={!canClaim}
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: canClaim ? '#00A2FF' : '#313338', 
            border: 'none', 
            color: canClaim ? 'white' : '#B5BAC1', 
            borderRadius: '4px', 
            cursor: canClaim ? 'pointer' : 'not-allowed', 
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          {canClaim ? "Claim 100 Robux" : "Claimed Today"}
        </button>
      </form>
    </div>
  );
}
