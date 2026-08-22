import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PanResponder, View } from "react-native";

interface AuthContexType {
  isLoggedIn: boolean;
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

  const resetTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

    {
      /**Set the timeout for 30 minutes */
    }

    if (user) {
      logoutTimer.current = setTimeout(() => {
        console.log("User inactive. Logging out....");
        logout();
      }, 1800000);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
    }),
  ).current;

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
  }, [user]);

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
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes (Login, Logout, Token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
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

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      setUser(null);
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
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
