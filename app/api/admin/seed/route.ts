import { NextRequest, NextResponse } from 'next/server';
import { seedRBAC } from '@/lib/rbac';
import { verifyAuth } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/rbac';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    
    if (auth.success && auth.user) {
      const isSuper = await isSuperAdmin(auth.user.id);
      if (!isSuper) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
    }

    await seedRBAC();

    return NextResponse.json({ 
      success: true, 
      message: 'RBAC data seeded successfully' 
    });
  } catch (error) {
    console.error('Error seeding RBAC:', error);
    return NextResponse.json({ error: 'Failed to seed RBAC data' }, { status: 500 });
  }
}
