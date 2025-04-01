import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RESOURCE_TYPES } from "@/lib/constants";
import { useLocation } from "wouter";

const Resources = () => {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split("?")[1] || "");
  const initialId = queryParams.get("id");
  const initialType = queryParams.get("type") || "all";
  
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedResource, setSelectedResource] = useState<number | null>(
    initialId ? parseInt(initialId) : null
  );
  
  const { toast } = useToast();
  
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/resources/${id}/bookmark`, undefined),
    onSuccess: async () => {
      // Invalidate resources query to refresh data
      await queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to bookmark resource: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedResource(null);
  };

  const handleResourceSelect = (id: number) => {
    setSelectedResource(id);
  };

  const toggleBookmark = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleBookmarkMutation.mutate(id);
  };

  const filteredResources = resources?.filter(resource => 
    selectedType === "all" || resource.type === selectedType
  );

  const selectedResourceDetails = resources?.find(
    resource => resource.id === selectedResource
  );

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Local Resources</h1>
        <p className="text-neutral-600">
          Find support services and programs in your area to help with your reentry journey.
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resource Types</CardTitle>
              <CardDescription>
                Filter resources by category to find what you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                orientation="vertical"
                value={selectedType}
                onValueChange={handleTypeChange}
                className="w-full"
              >
                <TabsList className="flex flex-col items-start justify-start h-auto">
                  <TabsTrigger value="all" className="w-full justify-start">
                    All Resources
                  </TabsTrigger>
                  {RESOURCE_TYPES.map(type => (
                    <TabsTrigger
                      key={type.value}
                      value={type.value}
                      className="w-full justify-start"
                    >
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="p-8 text-center">
              <div className="flex items-center justify-center">
                <span className="material-icons animate-spin text-primary-500">refresh</span>
                <span className="ml-2">Loading resources...</span>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedResourceDetails
                    ? "Resource Details"
                    : `${selectedType === "all" ? "All" : RESOURCE_TYPES.find(t => t.value === selectedType)?.label || selectedType} Resources`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredResources && filteredResources.length > 0 ? (
                  selectedResourceDetails ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">{selectedResourceDetails.name}</h2>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedResource(null)}
                        >
                          Back to List
                        </Button>
                      </div>
                      
                      <Badge className="mb-2">
                        {RESOURCE_TYPES.find(t => t.value === selectedResourceDetails.type)?.label || selectedResourceDetails.type}
                      </Badge>
                      
                      <div className="rounded-md bg-neutral-50 p-4">
                        <p className="text-lg mb-4">{selectedResourceDetails.description}</p>
                        
                        {selectedResourceDetails.address && (
                          <div className="mt-4">
                            <h3 className="font-semibold mb-1">Address:</h3>
                            <p className="text-neutral-700">{selectedResourceDetails.address}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex items-center text-sm text-neutral-500">
                          <span className="material-icons mr-1 text-sm">location_on</span>
                          {selectedResourceDetails.distance} miles away
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Button
                          variant="outline"
                          onClick={(e) => toggleBookmark(selectedResourceDetails.id, e)}
                          className="flex items-center"
                        >
                          <span className="material-icons mr-1 text-sm">
                            {selectedResourceDetails.bookmarked ? "bookmark" : "bookmark_border"}
                          </span>
                          {selectedResourceDetails.bookmarked ? "Bookmarked" : "Bookmark"}
                        </Button>
                        
                        <Button className="flex items-center">
                          <span className="material-icons mr-1 text-sm">map</span>
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredResources.map(resource => (
                        <div
                          key={resource.id}
                          onClick={() => handleResourceSelect(resource.id)}
                          className="rounded-md border border-neutral-100 bg-neutral-50 p-4 cursor-pointer hover-scale hover:border-primary-100 hover:bg-primary-50"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-neutral-800">{resource.name}</h3>
                            <button
                              onClick={(e) => toggleBookmark(resource.id, e)}
                              className="text-neutral-400 hover:text-primary-500"
                              aria-label={resource.bookmarked ? "Remove bookmark" : "Add bookmark"}
                            >
                              <span className="material-icons">
                                {resource.bookmarked ? "bookmark" : "bookmark_border"}
                              </span>
                            </button>
                          </div>
                          <p className="mb-2 text-sm text-neutral-600">{resource.description}</p>
                          <div className="flex justify-between">
                            <Badge variant="outline" className="text-xs">
                              {RESOURCE_TYPES.find(t => t.value === resource.type)?.label || resource.type}
                            </Badge>
                            <div className="flex items-center text-xs text-neutral-500">
                              <span className="material-icons mr-1 text-xs">location_on</span>
                              {resource.distance} miles away
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                      <span className="material-icons text-neutral-500">search</span>
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No Resources Found</h3>
                    <p className="text-neutral-600">
                      We couldn't find any resources matching your criteria.
                    </p>
                    <Button className="mt-4" onClick={() => setSelectedType("all")}>
                      Show All Resources
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Resources;
