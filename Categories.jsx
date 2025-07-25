import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../components/utils/translations";

const CategoryItem = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors"
  >
    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
      <img src={icon} alt={title} className="w-full h-full object-cover" />
    </div>
    <span className="text-lg font-semibold text-gray-900">{title}</span>
  </button>
);

export default function Categories() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    { 
      id: 'italian',
      title: t('italian'),
      icon: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b"
    },
    { 
      id: 'desserts',
      title: t('desserts'),
      icon: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e"
    },
    { 
      id: 'vegetarian',
      title: t('vegetarian'),
      icon: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
    },
    { 
      id: 'mexican',
      title: t('mexican'),
      icon: "https://images.unsplash.com/photo-1565299507177-b0ac66763828"
    },
    { 
      id: 'asian',
      title: t('asian'),
      icon: "https://images.unsplash.com/photo-1617093727343-374698b1b08d"
    },
    { 
      id: 'seafood',
      title: t('seafood'),
      icon: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44"
    },
    { 
      id: 'breakfast',
      title: t('breakfast'),
      icon: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666"
    },
    { 
      id: 'snacks',
      title: t('snacks'),
      icon: "https://images.unsplash.com/photo-1571091718767-18b5b1457add"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm px-4 py-4 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('categories')}</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              icon={category.icon}
              title={category.title}
              onClick={() => navigate(`/search?category=${category.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}