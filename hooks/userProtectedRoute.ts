import { useAuth } from "@/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
    const {isLoggedIn, loading} = useAuth()
    const segments = useSegments();
    const router = useRouter();

    useEffect(()=> {
        if(loading) return;

        
        const rootSegment = segments[0] as string | undefined;

        const isProtectedRoute = segments[0] === "orders" || segments[0] === "favorites";

        const inAuthRoute = rootSegment === "login" || rootSegment === "forgot-password";
        
        if(isLoggedIn && isProtectedRoute) {
            router.replace("/login");
        } else if(isLoggedIn && inAuthRoute) {
            router.replace("/");
        }
    }, [isLoggedIn, loading, segments, router]);
}