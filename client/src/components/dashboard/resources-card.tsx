import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Resource } from "@shared/schema";

const ResourcesCard = () => {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-neutral-800">Local Resources</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="material-icons animate-spin text-primary-500">refresh</span>
          </div>
        ) : resources && resources.length > 0 ? (
          <div className="space-y-3">
            {resources.slice(0, 3).map((resource) => (
              <Link
                key={resource.id}
                href={`/resources?id=${resource.id}`}
                className="block rounded-md border border-neutral-100 bg-neutral-50 p-3 transition-all hover:scale-[1.02] hover:border-primary-100 hover:bg-primary-50"
              >
                <h4 className="font-medium text-neutral-800">{resource.name}</h4>
                <p className="mb-1 text-sm text-neutral-600">{resource.description}</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <span className="material-icons mr-1 text-xs">location_on</span>
                  {resource.distance} miles away
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
            <p className="text-sm text-neutral-600">
              No local resources found.
            </p>
          </div>
        )}
        
        <Link href="/resources" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
          Find more resources <span className="material-icons align-text-bottom text-sm">chevron_right</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ResourcesCard;
