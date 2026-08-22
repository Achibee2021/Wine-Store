import { useAuth } from "@/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
    const {isLoggedIn, loading} = useAuth()
    const segments = useSegments();
    const router = useRouter();

    useEffect(()=> {
        if(loading) return;

        
        const inAunthGroup = segments[0] === "(tabs)";

        const isProtectedRoute = segments[0] === "orders" || segments[0] === "favorites";

        const publicRoutes = [
            "login",
            "forgot-password",
            "update-password",
            "wine-details",
            "modal",
        ];
        
        const isPublicRoute = publicRoutes.includes(segments[0] || "");

        if(isLoggedIn && !isPublicRoute && (inAunthGroup || isProtectedRoute)) {
            router.replace("/login");
        } else if(isLoggedIn && segments[0] === "login") {
            router.replace("/");
        }
    }, [isLoggedIn, loading, segments]);
}