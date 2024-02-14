import { useState, useEffect } from "react";
import { getUser } from "@/app/actions";

type User = {
  email: string;
  emailVerified: boolean;
  name: string;
  id: string;
  role: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
};
