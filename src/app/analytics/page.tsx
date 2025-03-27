"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "@/components/Loader";

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

/**
 * AnalyticsPage fetches all journal entries and generates two charts:
 * 1. Category Distribution (Pie Chart): How many entries per category.
 * 2. Monthly Entry Frequency (Bar Chart): How many entries were created each month.
 */
export default function AnalyticsPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all journal entries from the API.
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/journal");
        const data = await res.json();
        setJournals(data);
      } catch (err: any) {
        setError("Failed to fetch journal entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  // Aggregate category data.
  // Loop over each journal entry and then over its associated categories.
  const categoryCounts: { [key: string]: number } = {};
  journals.forEach((journal) => {
    journal.entryCategories.forEach((ec: any) => {
      const catName = ec.category.name;
      if (categoryCounts[catName]) {
        categoryCounts[catName] += 1;
      } else {
        categoryCounts[catName] = 1;
      }
    });
  });

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Entries per Category",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#66BB6A",
          "#BA68C8",
          "#FFA726",
          "#42A5F5",
        ],
      },
    ],
  };

  // Aggregate monthly frequency data.
  // Convert each entry's creation date into a 'YYYY-MM' string.
  const monthlyCounts: { [key: string]: number } = {};
  journals.forEach((journal) => {
    const date = new Date(journal.created_at);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });

  // Sort months in ascending order.
  const sortedMonths = Object.keys(monthlyCounts).sort();
  const monthlyData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Entries per Month",
        data: sortedMonths.map((month) => monthlyCounts[month]),
        backgroundColor: "#42A5F5",
      },
    ],
  };

  if (loading) return <Loader />;
  if (error) return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="p-4 min-h-[165px] flex items-center justify-center">
          <p className="p-4 text-red-500">{error}</p>
        </div>
      </div>
    </section>
  );

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Journal Analytics</h1>

                {/* Category Distribution Chart */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4">Category Distribution</h2>
                        {Object.keys(categoryCounts).length > 0 ? (
                            <Pie data={categoryData} width={250} height={250} />
                        ) : (
                            <p>No category data available.</p>
                        )}
                    </div>

                {/* Monthly Entry Frequency Chart */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Monthly Entry Frequency</h2>
                    {Object.keys(monthlyCounts).length > 0 ? (
                        <Bar data={monthlyData} width={250} height={250} options={{ responsive: true }} />
                    ) : (
                        <p>No monthly data available.</p>
                    )}
                </div>
            </div>
        </div>
    </section>
  );
}
