// Common type definitions

// Result pattern for data fetching with error handling
export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };
