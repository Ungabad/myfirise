import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Article as ArticleType } from "@shared/schema";
import { ARTICLE_CATEGORIES } from "@/lib/constants";

const Article = () => {
  const { id } = useParams();
  const articleId = Number(id);

  const { data: article, isLoading, error } = useQuery<ArticleType>({
    queryKey: [`/api/articles/${articleId}`],
  });

  const { data: relatedArticles } = useQuery<ArticleType[]>({
    queryKey: ["/api/articles"],
    select: (data) => {
      if (!article) return [];
      return data
        .filter((a) => a.id !== articleId && a.category === article.category)
        .slice(0, 3);
    },
    enabled: !!article,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="material-icons animate-spin text-primary-500">refresh</span>
        <span className="ml-2">Loading article...</span>
      </div>
    );
  }

  if (error || !article) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <span className="material-icons text-error">error</span>
        </div>
        <h3 className="mb-2 text-lg font-medium">Article Not Found</h3>
        <p className="mb-6 text-neutral-600">
          The article you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link href="/education">Back to Education</Link>
        </Button>
      </Card>
    );
  }

  const categoryLabel = ARTICLE_CATEGORIES.find(c => c.value === article.category)?.label || article.category;

  return (
    <>
      <div className="mb-4">
        <Link href="/education" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700">
          <span className="material-icons mr-1 text-sm">arrow_back</span>
          Back to Education
        </Link>
      </div>
      
      <article className="prose prose-lg max-w-none">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-primary-600 bg-primary-50/50">
            {categoryLabel}
          </Badge>
          <h1 className="mt-0 !mb-0 text-3xl font-bold text-neutral-800">{article.title}</h1>
        </div>
        
        {article.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="h-auto w-full max-h-80 object-cover"
            />
          </div>
        )}
        
        <p className="lead text-xl text-neutral-700">{article.description}</p>
        
        <div 
          className="mt-6 article-content" 
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
      
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map(relatedArticle => (
              <Card key={relatedArticle.id} className="group overflow-hidden hover:border-primary-200">
                <Link href={`/education/${relatedArticle.id}`}>
                  <div className="h-40 w-full overflow-hidden">
                    <img 
                      src={relatedArticle.imageUrl} 
                      alt={relatedArticle.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-medium text-neutral-800 group-hover:text-primary-600">
                      {relatedArticle.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-neutral-600">
                      {relatedArticle.description}
                    </p>
                    <div className="mt-2 flex items-center text-sm font-medium text-primary-600">
                      Read article
                      <span className="material-icons ml-1 text-sm">arrow_forward</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Article;
