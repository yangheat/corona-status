import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";

const Contnets = () => {
  const [confirmData, setConfirmData] = useState({});
  const [quarantinedData, setQuarantinedData] = useState({});
  const [compareData, setCompareData] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(
        "https://api.covid19api.com/total/dayone/country/kr"
      );
      makeData(res.data);
    };

    const makeData = (items) => {
      const arr = items.reduce((acc, cur) => {
        const currentData = new Date(cur.Date);
        const year = currentData.getFullYear();
        const month = currentData.getMonth();
        const date = currentData.getDate();
        const confirmed = cur.Confirmed;
        const active = cur.Confirmed;
        const death = cur.Death;
        const recovered = cur.Recovered;

        const findItem = acc.find((a) => a.year === year && a.month === month);

        if (!findItem) {
          acc.push({ year, month, date, confirmed, active, death, recovered });
        }
        if (findItem && findItem.date < date) {
          findItem.active = active;
          findItem.death = death;
          findItem.date = date;
          findItem.year = year;
          findItem.month = month;
          findItem.recovered = recovered;
          findItem.confirmed = confirmed;
        }

        return acc;
      }, []);

      const labels = arr.map((a) => `${a.month + 1}`);

      setConfirmData({
        labels,
        datasets: [
          {
            label: "국내 누적 확진자",
            backgroundColor: " salmon",
            fill: true,
            data: arr.map((a) => a.confirmed),
          },
        ],
      });

      setQuarantinedData({
        labels,
        datasets: [
          {
            label: "월별 격리자 현황",
            borderColor: " salmon",
            fill: false,
            data: arr.map((a) => a.active),
          },
        ],
      });

      const last = arr[arr.length - 1];
      console.log(last);
      setCompareData({
        labels: ["확진자", "격리해제", "사망"],
        datasets: [
          {
            label: "누적 확진, 해제, 사망 비율",
            backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
            borderColor: ["#ff3d67", "#059bff", "#ffc233"],
            fill: false,
            data: [last.confirmed, last.recovered, last.death],
          },
        ],
      });
    };

    fetchEvents();
  }, []);

  return (
    <section>
      <h2>국내 코로나 현황</h2>
      <div className="contents">
        <div>
          <Bar
            data={confirmData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "누적 확진자 동향",
                  font: { size: 16 },
                },
                legend: { position: "bottom" },
              },
            }}
          />
          <Line
            data={quarantinedData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "월별 격리자 추이",
                  font: { size: 16 },
                },
                legend: { position: "bottom" },
              },
            }}
          />
          <Doughnut
            data={compareData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: `누적 확진, 해제, 사망 (${new Date().getMonth()}월 현재)`,
                  font: { size: 16 },
                },
                legend: { position: "bottom" },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Contnets;
