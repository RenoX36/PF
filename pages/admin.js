import { useAuth } from '../lib/auth';
import { db, auth } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";

export default function Admin() {
  const user = useAuth();
  const [data, setData] = useState({ used_iphone: [], used_android: [], brand_new: [] });

  useEffect(() => {
    if (!user) return;
    const subs = ['used_iphone', 'used_android', 'brand_new'].map(col =>
      onSnapshot(query(collection(db, col)), snapshot => {
        setData(prev => ({ ...prev, [col]: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) }));
      })
    );
    return () => subs.forEach(unsub => unsub());
  }, [user]);

  const addDevice = async (col) => {
    const name = prompt("Device name?");
    if (!name) return;
    await addDoc(collection(db, col), { name, buy: 0, sell: 0, sold: false });
  };

  const toggleSold = async (col, item) => {
    const ref = doc(db, col, item.id);
    await updateDoc(ref, { sold: !item.sold });
  };

  const deleteItem = async (col, item) => {
    if (confirm("Delete?")) await deleteDoc(doc(db, col, item.id));
  };

  const logout = async () => {
    await signOut(auth);
  };

  const stats = (col) => ({
    total: data[col].filter(d => !d.sold).length,
    sold: data[col].filter(d => d.sold),
    rev: data[col].filter(d => d.sold).reduce((a,d)=>a+d.sell,0),
    profit: data[col].filter(d => d.sold).reduce((a,d)=>a+(d.sell-d.buy),0)
  });

  const totStock = ['used_iphone','used_android','brand_new'].reduce((a,c)=>a+stats(c).total,0);
  const totSold = stats('used_iphone').sold.length;
  const totSales = stats('used_iphone').rev;
  const totProfit = stats('used_iphone').profit;

  return (
    <div className="p-4">
      <header className="flex justify-between items-center bg-blue-600 text-white p-4 rounded">
        <h1>Phone Fusion Admin</h1>
        <button onClick={logout} className="bg-white text-blue-600 px-3 py-1 rounded">Logout</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
        {[
          ['Total Stock', totStock],
          ['Sold Phones', totSold],
          ['Total Sales (৳)', totSales],
          ['Net Profit (৳)', totProfit],
        ].map(([label,val],i)=>(
          <div key={i} className="bg-white p-4 rounded shadow text-center">
            <div className="text-blue-600 font-bold">{label}</div>
            <div className="text-2xl">{val}</div>
          </div>
        ))}
      </div>

      {['used_iphone','used_android','brand_new'].map(col => (
        <section key={col} className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">{col.replace('_',' ').toUpperCase()}</h2>
          <button onClick={()=>addDevice(col)} className="bg-blue-500 text-white px-2 py-1 rounded mb-2">+ Add</button>
          <table className="w-full border">
            <thead><tr className="bg-blue-50">
              <th>Name</th><th>Buy</th><th>Sell</th><th>Profit</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {data[col].map(item => (
                <tr key={item.id} className="hover:bg-blue-50">
                  <td>{item.name}</td>
                  <td><input type="number" value={item.buy} onChange={e => updateDoc(doc(db,col,item.id),{buy: +e.target.value})} /></td>
                  <td><input type="number" value={item.sell} onChange={e => updateDoc(doc(db,col,item.id),{sell: +e.target.value})} /></td>
                  <td>৳{item.sell - item.buy}</td>
                  <td>{item.sold ? '✅' : '📦'}</td>
                  <td>
                    <button onClick={()=>toggleSold(col,item)} className="mr-1">Toggle</button>
                    <button onClick={()=>deleteItem(col,item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}