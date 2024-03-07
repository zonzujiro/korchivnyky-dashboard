import { getFundraisingCampaigns } from '@/dal';
import { redirect } from 'next/navigation';

const FundraisingsPage = async () => {
  const fundraisings = await getFundraisingCampaigns();

  redirect(`fundraisings/${fundraisings[0].id}`);
};

export default FundraisingsPage;
