import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout, MobileHeader, MobileContent } from "@/components/layout/MobileLayout";
import { TazaCard } from "@/components/ui/taza-card";
import { useCategories } from "@/hooks/useCategories";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CategoriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="Categories" />
        <MobileContent className="pt-4">
          <div className="text-center">Loading categories...</div>
        </MobileContent>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout>
        <MobileHeader title="Categories" />
        <MobileContent className="pt-4">
          <div className="text-center text-red-500">Error loading categories</div>
        </MobileContent>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <MobileHeader
        title="Categories"
        leftAction={
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        }
      />
      <MobileContent className="pt-4">
        <div className="grid gap-3">
          {categories?.map((category) => (
            <TazaCard
              key={category.id}
              variant="elevated"
              className="overflow-hidden"
            >
              <button
                onClick={() => navigate(`/category/${category.id}`)}
                className="w-full flex items-center gap-4 p-4"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    category.color
                  )}
                >
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">Fresh & Quality</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </TazaCard>
          ))}
        </div>
      </MobileContent>
    </MobileLayout>
  );
};

export default CategoriesScreen;
