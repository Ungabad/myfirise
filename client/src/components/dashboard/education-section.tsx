import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";

const EducationSection = () => {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <section className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neutral-800">Financial Education</h3>
        <Link href="/education" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View all resources <span className="material-icons align-text-bottom text-sm">chevron_right</span>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-icons animate-spin text-primary-500">refresh</span>
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/education/${article.id}`}
              className="group rounded-lg border border-neutral-100 bg-white p-5 shadow-sm transition-all hover:border-primary-100 hover:shadow-md"
            >
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="mb-2 text-lg font-medium text-neutral-800 group-hover:text-primary-600">
                {article.title}
              </h4>
              <p className="text-sm text-neutral-600">
                {article.description}
              </p>
              <div className="mt-3 inline-flex items-center text-sm font-medium text-primary-600">
                Read article <span className="material-icons ml-1 text-sm">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-neutral-600">Educational content is being loaded.</p>
        </div>
      )}
    </section>
  );
};

export default EducationSection;
