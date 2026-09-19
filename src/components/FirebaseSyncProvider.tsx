'use client';

import React, { useEffect } from 'react';
import { subscribeToAuthChanges, fetchCloudResources, fetchAttendanceFromCloud } from '@/lib/firebase-services';
import { HubStore } from '@/lib/store';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function FirebaseSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // 1. Sync Authentication State
    const unsubscribeAuth = subscribeToAuthChanges((fbUser) => {
      if (fbUser && fbUser.email) {
        const email = fbUser.email.toLowerCase();
        const isAdmin = email.startsWith('admin') || email.includes('faculty') || email.includes('council');
        const formattedName = fbUser.displayName || email.split('@')[0];

        HubStore.setCurrentUser({
          id: fbUser.uid,
          email,
          fullName: formattedName,
          avatarUrl: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=10B981&color=080A08&bold=true&size=128`,
          role: isAdmin ? 'admin' : 'student',
          currentSemester: 1,
          createdAt: new Date().toISOString(),
        });

        // 2. Fetch User Attendance from Firestore
        fetchAttendanceFromCloud(fbUser.uid).then((cloudAttendance) => {
          if (cloudAttendance && cloudAttendance.length > 0) {
            HubStore.setAttendanceRecords(cloudAttendance);
          }
        });
      }
    });

    // 3. Hydrate Ingested Resources from Firestore
    fetchCloudResources().then((cloudResources) => {
      if (cloudResources && cloudResources.length > 0) {
        cloudResources.forEach((res) => {
          HubStore.addOrUpdateResourceSilent(res);
        });
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return <>{children}</>;
}
