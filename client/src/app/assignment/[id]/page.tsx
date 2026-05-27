'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAssignmentByIdQuery } from '@/services/api';
import QuestionPaper from '@/components/output/QuestionPaper';

export default function AssignmentOutputPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: assignment, isLoading, error } = useGetAssignmentByIdQuery(id);

  // Redirect if not completed
  useEffect(() => {
    if (assignment && assignment.status !== 'completed' && assignment.status !== 'failed') {
      // It's still processing, redirect back to dashboard
      // Or we could show a waiting screen here
      router.push('/');
    }
  }, [assignment, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flex: 1 }}>
        <p className="p3-medium" style={{ color: 'var(--text-muted)' }}>Loading paper...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flex: 1 }}>
        <p className="p3-medium" style={{ color: '#E53E3E' }}>Failed to load assignment.</p>
      </div>
    );
  }

  if (!assignment.generatedPaper) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flex: 1 }}>
        <p className="p3-medium" style={{ color: '#E53E3E' }}>Paper generation failed or incomplete.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <QuestionPaper 
        paper={assignment.generatedPaper} 
        onPrint={handlePrint}
        onShare={handleShare}
      />
    </div>
  );
}
