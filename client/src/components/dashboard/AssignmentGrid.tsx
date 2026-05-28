import type { IAssignment } from '../../types';
import AssignmentCard from './AssignmentCard';

interface Props {
  assignments: IAssignment[];
}

export default function AssignmentGrid({ assignments }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      marginTop: '24px'
    }}>
      {assignments.map(assignment => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
}
