'use client';

import { useGetAssignmentsQuery } from '@/services/api';
import EmptyState from '@/components/dashboard/EmptyState';
import AssignmentGrid from '@/components/dashboard/AssignmentGrid';
import FilterBar from '@/components/dashboard/FilterBar';

export default function Dashboard() {
  const { data: assignments, isLoading, error } = useGetAssignmentsQuery();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flex: 1 }}>
        <p className="p3-medium" style={{ color: 'var(--text-muted)' }}>Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flex: 1 }}>
        <p className="p3-medium" style={{ color: '#E53E3E' }}>Failed to load assignments. Is the server running?</p>
      </div>
    );
  }

  const hasAssignments = assignments && assignments.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {hasAssignments ? (
        <>
          <div style={{ marginBottom: '8px' }}>
            <p className="p3-medium" style={{ color: 'var(--text-secondary)' }}>
              Manage and create assignments for your classes.
            </p>
          </div>
          
          <FilterBar />
          <AssignmentGrid assignments={assignments} />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
