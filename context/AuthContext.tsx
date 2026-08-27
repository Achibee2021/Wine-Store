import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import * as linking from "expo-linking";
import { useRouter } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PanResponder, View } from "react-native";

interface AuthContexType {
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContexType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const logoutTimer = useRef<any>(null);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

    if (user) {
      logoutTimer.current = setTimeout(() => {
        console.log("User inactive. Logging out....");
        logout();
      }, 1800000);
    }
  }, [user, logout]);

  const panResponder = React.useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
    });
  }, [resetTimer]);

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dist-chi-eight-57.vercel.app/update-password",
    });

    if (error) {
      alert(error.message);
      throw error;
    } else {
      alert("Password reset email sent! check your inbox.");
      router.back();
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
      throw error;
    }

    alert("Password update successfilly!");
    router.replace("/login");
  };

  useEffect(() => {
    if (user) {
      resetTimer();
    }
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [user, resetTimer]);

  // --- PERSISTENCE: Chek if user is already logged in on startup ---

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // ckeck current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) console.error("Session fetch error:", error);

        if (isMounted) {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (Login, Logout, Token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);

          if (event === "PASSWORD_RECOVERY") {
            setTimeout(() => {
              router.push("/update-password");
            }, 0);
          }
        }
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Deep Linking for mobile token recovery
  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      if (url.includes("update-password") || url.includes("access_token")) {
        const fragment = url.split("#")[1] || url.split("?")[1];

        if (!fragment) return;

        const params = new URLSearchParams(fragment);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      }
    };

    linking.getInitialURL().then(handleDeepLink);

    const subscription = linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.replace("/");
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://dist-chi-eight-57.vercel.app",
      },
    });

    if (error) alert(error.message);
    else alert("ckeck Your email for the confirmation link");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        isAuthenticated: !!user,
        user,
        signIn,
        signUp,
        logout,
        resetPassword,
        updatePassword,
        loading,
      }}
    >
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        {children}
      </View>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within an AuthProvider");
  return context;
};
