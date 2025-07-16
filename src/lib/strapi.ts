import qs from "qs";
import { StrapiResponse, StrapiAboutPage } from "@/types/strapi";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Debug configuration
console.log("Strapi Configuration:", {
  API_URL: STRAPI_API_URL,
  HAS_TOKEN: !!STRAPI_API_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
});

if (!STRAPI_API_URL) {
  throw new Error("Missing NEXT_PUBLIC_STRAPI_API_URL environment variable");
}

if (!STRAPI_API_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_STRAPI_API_TOKEN environment variable");
}

interface StrapiQueryParams {
  populate?: string | string[] | Record<string, any>;
  filters?: Record<string, any>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

interface StrapiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
}

export async function fetchStrapiData<T>(
  endpoint: string,
  params: StrapiQueryParams = {}
): Promise<T> {
  try {
    // Ensure endpoint starts with a slash
    const formattedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    // Build query parameters using qs
    const query = qs.stringify(params, {
      encodeValuesOnly: true,
    });

    const url = `${STRAPI_API_URL}/api${formattedEndpoint}${query ? `?${query}` : ""}`;

    console.log("Making Strapi request:", {
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer [hidden]",
      },
      params,
    });

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 60 },
        // cache: 'no-store', // Disable caching to ensure fresh data
      });

      console.log("Response details:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response:", {
          status: response.status,
          statusText: response.statusText,
          error: data,
        });
        throw new Error(
          `Failed to fetch data from Strapi: ${response.status} ${response.statusText}`
        );
      }

      console.log("Response data structure:", {
        hasData: !!data,
        keys: Object.keys(data),
        dataType: data?.data ? typeof data.data : "no data property",
      });

      return data as T;
    } catch (fetchError: any) {
      console.error("Fetch error:", {
        message: fetchError.message,
        cause: fetchError.cause,
        url,
      });
      throw new Error(`Failed to connect to Strapi: ${fetchError.message}`);
    }
  } catch (error: any) {
    console.error("Strapi request error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

// Helper function to get image URL from Strapi
export function getStrapiMedia(url: string | null): string {
  const env = process.env.NODE_ENV;
  if (env !== "production") {
    console.log("url From getStrapiMedia", url);
    return url || "";
  } else {
    if (url && url.includes("/_next/image?url=")) {
      console.log("url From getStrapiMedia in production", url);
      console.log("STRAPI_API_URL", STRAPI_API_URL);
      let cleanUrl = url?.replace("/_next/image?url=", "");
      cleanUrl = decodeURIComponent(cleanUrl);
      return `${STRAPI_API_URL}/${cleanUrl}`;
    }
    return `${STRAPI_API_URL}/${url}`;
  }
}

// Helper function to format Strapi date
export function formatStrapiDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function getAboutPage(): Promise<StrapiAboutPage> {
  const response = await fetchStrapiData<StrapiResponse<StrapiAboutPage>>(
    "/about-page",
    {
      populate: {
        seo: true,
        vision: true,
        blog: true,
        team: true,
        contactSection: true,
      },
    }
  );

  console.log("About Page Response:", JSON.stringify(response, null, 2));

  if (!response.data) {
    throw new Error("Failed to fetch about page data");
  }

  return response.data;
}
