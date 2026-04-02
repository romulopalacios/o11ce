import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { footballAPIClient } from '@/server/services/football/client';
import GroupDetailClient from './GroupDetailClient';

export const revalidate = 600;

interface GroupPageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export async function generateMetadata({ params }: GroupPageProps): Promise<Metadata> {
  const { groupId } = await params;
  const groupName = groupId.replace('_', ' ').replace('-', ' ').toUpperCase();
  return {
    title: `${groupName} - Detalles - O11CE`,
    description: `Detalles, tabla de posiciones y fixture del ${groupName}.`,
  };
}

export default async function GroupDetailPage({ params }: GroupPageProps) {
  const { groupId } = await params;
  const rawGroupId = groupId.toUpperCase().replace('-', '_'); // e.g. group_a -> GROUP_A

  const [standingsResponse, matchesResponse] = await Promise.all([
    footballAPIClient.getStandings(),
    footballAPIClient.getMatches(), // all matches
  ]);

  const allGroups = standingsResponse?.standings?.filter((s: any) => s.type === 'TOTAL') || [];
  
  // Normalize strings for comparison due to API returning "GROUP A" vs URL "GROUP_A"
  const normalizedGroupId = groupId.toUpperCase().replace(/[-_ ]/g, '');
  const currentGroup = allGroups.find((g: any) => 
    (g.group || '').toUpperCase().replace(/[-_ ]/g, '') === normalizedGroupId
  );

  if (!currentGroup && allGroups.length > 0) {
    return notFound();
  }

  // Matches associated with this group
  const groupMatches = matchesResponse?.matches?.filter(
    (m: any) => (m.group || '').toUpperCase().replace(/[-_ ]/g, '') === normalizedGroupId || 
                (m.group && currentGroup?.group && m.group === currentGroup.group)
  ) || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <GroupDetailClient 
        allGroups={allGroups}
        currentGroup={currentGroup}
        groupMatches={groupMatches}
        groupId={normalizedGroupId} // Pass normalized ID or keep rawGroupId if needed
      />
    </div>
  );
}