// Common type definitions

// Server Action return type
export type ActionResult = {
    success: boolean;
    error?: string;
};

// Result pattern for data fetching with error handling
export type Result<T> = 
    | { success: true; data: T }
    | { success: false; error: string };
