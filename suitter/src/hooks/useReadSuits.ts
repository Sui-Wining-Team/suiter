import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { SUITTER_CONFIG } from "../lib/suitterContract";

/**
 * Hook to read all suit posts using PostCreatedEvents
 * Events track all posts ever created, then we fetch the actual objects
 */
export function useReadSuits() {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["readSuits"],
    queryFn: async () => {
      console.log("Fetching posts from blockchain...");
      console.log("Fetching posts from events...");

      // Get all SuitCreatedEvents
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${SUITTER_CONFIG.PACKAGE_ID}::${SUITTER_CONFIG.MODULE_NAME}::SuitCreated`,
        },
        limit: 100,
        order: "descending",
      });

      console.log("Events found:", events.data.length);
      console.log("Events:", events.data);

      // Extract suit IDs from events
      const postIds = events.data.map(
        (event) => (event.parsedJson as any).suit_id,
      );

      console.log("Post IDs:", postIds);

      if (postIds.length === 0) {
        console.log("No posts found");
        return [];
      }

      // Fetch all post objects
      const posts = await suiClient.multiGetObjects({
        ids: postIds,
        options: { showContent: true },
      });

      console.log("Fetched posts:", posts);
      // Return only the fields from each post
      const results = posts
        .map((obj) => {
          if (obj.data?.content && "fields" in obj.data.content) {
            return obj.data.content.fields;
          }
          return null;
        })
        .filter(Boolean);

      console.log("Fetched posts:", results.length);
      console.log("Post data sample:", results[0]);
      return results;
    },
    enabled: !!suiClient,
  });
}
