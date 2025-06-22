"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Define the user type to include imageUrl
  type UserType = {
    _id: string;
    username: string;
    email: string;
    isPro: boolean;
    imageUrl?: string;
  };

  // Get users filtered by email search term
  const users = (useQuery(api.users.getAllUsers, { 
    emailSearch: searchQuery.length > 2 ? searchQuery : undefined 
  }) as UserType[]) || [];
  
  // Only show results if there's a minimum of 3 characters
  const showResults = searchQuery.length > 2 && users.length > 0;

  // Handle clicking outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (userId: string) => {
    router.push(`/profile/${userId}`);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  return (
    <div className="max-w-md w-full mx-auto mb-8" ref={searchRef}>
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search users by email..."
            className="bg-[#1e1e2e]/80 w-full pl-10 pr-10 py-3 rounded-xl border border-[#313244] 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-200" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isSearchFocused && showResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute mt-2 w-full bg-[#1e1e2e]/95 backdrop-blur-xl 
                         rounded-xl border border-[#313244] shadow-2xl z-50 overflow-hidden"
            >
              <div className="py-2">
                {users.map((user) => (
                  <motion.button
                    key={user._id}
                    onClick={() => handleUserSelect(user._id)}
                    className="w-full flex items-center px-4 py-3 hover:bg-[#262637] transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.username || "User"}
                          className="h-10 w-10 rounded-full object-cover border border-[#313244]"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 
                                     flex items-center justify-center border border-[#313244]">
                          <User className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">{user.username || "Anonymous"}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                      {user.isPro && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                          PRO
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}