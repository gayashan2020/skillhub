// import { useState, useEffect } from "react";
// import { apiRequest } from "@/lib/api";
// import AdminLayout from "@/components/layout/AdminLayout/AdminLayout";

// interface BaseEntity {
//   id: number;
//   title: string;
//   content: string;
// }

// const BasePage = () => {
//   const [bases, setBases] = useState<BaseEntity[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [newBase, setNewBase] = useState({ title: "", content: "" });

//   const fetchBases = async () => {
//     setLoading(true);
//     try {
//       const data = await apiRequest<BaseEntity[]>("/api/base");
//       setBases(data);
//     } catch (error) {
//       console.error("Failed to fetch entities", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createBase = async () => {
//     try {
//       const base = await apiRequest<BaseEntity>("/api/base", "POST", newBase);
//       setBases((prev) => [base, ...prev]);
//       setNewBase({ title: "", content: "" });
//     } catch (error) {
//       console.error("Failed to create entity", error);
//     }
//   };

//   useEffect(() => {
//     fetchBases();
//   }, []);

//   return (
//     <div className="container mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Base Entities</h1>
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Title"
//           value={newBase.title}
//           onChange={(e) => setNewBase({ ...newBase, title: e.target.value })}
//           className="border rounded p-2 w-full mb-2"
//         />
//         <textarea
//           placeholder="Content"
//           value={newBase.content}
//           onChange={(e) => setNewBase({ ...newBase, content: e.target.value })}
//           className="border rounded p-2 w-full mb-2"
//         />
//         <button
//           onClick={createBase}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Create Entity
//         </button>
//       </div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {bases && bases.map((base) => (
//             <li key={base.id} className="mb-4">
//               <h2 className="text-xl font-semibold">{base.title}</h2>
//               <p>{base.content}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// // Integrate AdminLayout using getLayout
// BasePage.getLayout = function getLayout(page: React.ReactElement) {
//   return <AdminLayout>{page}</AdminLayout>;
// };

// export default BasePage;
