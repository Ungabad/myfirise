import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { ARTICLE_CATEGORIES } from "@/lib/constants";

const Education = () => {
  const [location, setLocation] = useLocation();
  const queryParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = queryParams.get("category") || "all";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category !== "all") {
      setLocation(`/education?category=${category}`, { replace: true });
    } else {
      setLocation("/education", { replace: true });
    }
  };

  const filteredArticles = articles?.filter(article => 
    selectedCategory === "all" || article.category === selectedCategory
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Financial Education</h1>
        <p className="text-neutral-600">Learn the essentials of personal finance with these resources.</p>
      </div>
      
      <Tabs defaultValue={selectedCategory} onValueChange={handleCategoryChange}>
        <div className="mb-6 overflow-x-auto">
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            {ARTICLE_CATEGORIES.map(category => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={selectedCategory} className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <span className="material-icons animate-spin text-primary-500">refresh</span>
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map(article => (
                <Link key={article.id} href={`/education/${article.id}`}>
                  <Card className="group overflow-hidden hover:border-primary-200 hover:shadow-md">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge
                        className="absolute right-3 top-3 bg-white/90 text-primary-600"
                        variant="outline"
                      >
                        {ARTICLE_CATEGORIES.find(c => c.value === article.category)?.label || article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="mb-2 text-xl font-semibold text-neutral-800 group-hover:text-primary-600">
                        {article.title}
                      </h3>
                      <p className="mb-4 text-sm text-neutral-600">
                        {article.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary-600">
                        Read article
                        <span className="material-icons ml-1 text-sm">arrow_forward</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                <span className="material-icons text-primary-500">school</span>
              </div>
              <h3 className="mb-2 text-lg font-medium">No Articles Found</h3>
              <p className="mb-6 text-neutral-600">
                There are no articles available in this category at the moment.
              </p>
              <Button onClick={() => handleCategoryChange("all")}>View All Topics</Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Education;
