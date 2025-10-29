// This file contains utility functions for the application.

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Add more utility functions as needed.