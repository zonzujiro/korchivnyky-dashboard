import { redirect } from 'next/navigation';
import { getFundraisingCampaigns } from './dal';

export default async function Page() {
  const fundraisings = await getFundraisingCampaigns();

  redirect(`/fundraisings/${fundraisings[0].id}/jars`);
}
