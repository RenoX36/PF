import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [phones, setPhones] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        // Listen to Firestore collection
        const colRef = collection(db, "used_iphone");
        const unsubData = onSnapshot(colRef, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPhones(data);
        });

        return () => unsubData();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>📱 Used Phones</h2>
      {phones.length === 0 ? (
        <p>No phones in stock.</p>
      ) : (
        phones.map((p) => (
          <div key={p.id}>
            <strong>{p.name}</strong> — Buy: ৳{p.buy} / Sell: ৳{p.sell}
          </div>
        ))
      )}
    </div>
  );
}
