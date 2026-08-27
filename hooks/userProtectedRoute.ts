import { useAuth } from "@/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute() {
    const {isLoggedIn, loading} = useAuth()
    const segments = useSegments();
    const router = useRouter();

    useEffect(()=> {
        if(loading) return;

        const currentSegment = segments[0] as string | undefined;

        const isProtectedRoute = currentSegment === "orders" || currentSegment === "favorites";

        const isGuestOnlyRoute = currentSegment === "login" || currentSegment === "forgot-password";
        

        if(!isLoggedIn && isProtectedRoute) {
            router.replace("/login");
        } else if(isLoggedIn && isGuestOnlyRoute) {
            router.replace("/");
        }
    }, [isLoggedIn, loading, segments, router]);
}