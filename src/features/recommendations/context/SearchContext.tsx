import { createContext, ReactNode, useContext, useState } from "react";

type Search = {
    city: string;
    favoriteTemperature: string;
    style: string;
};

export type SearchContextType = {
    search: Search | null;
    setSearch: (search: Search) => void;
};

const SearchContext = createContext<SearchContextType | null | undefined>(
    undefined
);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [search, setSearch] = useState<Search | null>(null);

    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }

    return context;
}
