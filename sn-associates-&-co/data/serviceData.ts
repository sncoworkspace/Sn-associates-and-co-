import { ProfessionalService } from '../types';
import { MARKETPLACE_SERVICES } from './serviceMarketplaceData';

export const fallbackServices: ProfessionalService[] = MARKETPLACE_SERVICES.map(s => ({
  id: s.id,
  name: s.name,
  category: s.category,
  categoryKey: s.categoryKey,
  categorySlug: s.categorySlug,
  description: s.description,
  applicableClients: ["Businesses", "Startups", "Individuals"],
  fees: s.price,
  priceNumber: s.priceNumber,
  feeNote: s.feeNote,
  rating: s.rating,
  reviewCount: s.reviewCount,
  turnaround: s.turnaround,
  popular: s.popular,
  status: "Active",
  resources: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z"
}));
