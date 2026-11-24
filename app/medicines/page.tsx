import React from 'react';
import { MedicinesView } from '@/components/MedicinesView';
import { getMedicinesAction } from '@/app/actions/medicines';

export const dynamic = 'force-dynamic';

export default async function MedicinesPage() {
  const res = await getMedicinesAction();
  const medicines = res.data || [];

  return <MedicinesView medicines={medicines} />;
}
