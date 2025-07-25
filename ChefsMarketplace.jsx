import React from 'react';
import ServiceListPage from '../components/common/ServiceListPage';
import { Dish } from '@/api/entities';
import { useTranslation } from '../components/utils/translations';

const mockDishes = [
  {
    id: '1',
    name: 'Gourmet Burger Deluxe',
    price: 22.50,
    photo_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop',
    rating_average: 4.8,
    cook_name: 'Chef Antoine',
    description: 'A juicy gourmet burger with all the trimmings.'
  },
  {
    id: '2',
    name: 'Authentic Italian Pasta',
    price: 18.00,
    photo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
    rating_average: 4.9,
    cook_name: 'Maria Rossi',
    description: 'Classic pasta dish made with love and fresh ingredients.'
  },
  {
    id: '3',
    name: 'Vegan Buddha Bowl',
    price: 16.50,
    photo_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop',
    rating_average: 4.7,
    cook_name: 'Healthy Bites',
    description: 'A delicious and nutritious bowl of vegan goodness.'
  },
  {
    id: '4',
    name: 'Spicy Thai Green Curry',
    price: 19.00,
    photo_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&auto=format&fit=crop',
    rating_average: 4.8,
    cook_name: 'Siam Flavors',
    description: 'Aromatic and spicy green curry with chicken or tofu.'
  },
  {
    id: '5',
    name: 'Chocolate Lava Cake',
    price: 9.50,
    photo_url: 'https://images.unsplash.com/photo-1586985289936-76a02a421526?w=400&auto=format&fit=crop',
    rating_average: 4.9,
    cook_name: 'Sweet Treats',
    description: 'Decadent chocolate cake with a molten center.'
  },
  {
    id: '6',
    name: 'Fresh Sushi Platter',
    price: 28.00,
    photo_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&auto=format&fit=crop',
    rating_average: 4.9,
    cook_name: 'Tokyo Express',
    description: 'A beautiful platter of assorted fresh sushi.'
  }
];

export default function ChefsMarketplace() {
  const { t } = useTranslation();
  return (
    <ServiceListPage
      entity={Dish}
      itemType="dish"
      title={t('marketplace', 'Chefs Marketplace')}
      subtitle={t('discoverLocalChefs', 'Discover and order from talented local chefs')}
      mockItems={mockDishes}
    />
  );
}