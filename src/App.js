import React, { useEffect, useState } from "react";
import { getData, addData, deleteData } from "../src/util/shareFunctions";
import { MdOutlineAddCircleOutline, MdOutlineRemoveCircleOutline } from 'react-icons/md';
import Popup from './component/Popup';
import ExportJsonToExcel from './component/ExportJsonToExcel'

const App = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [newItem, setNewItem] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupId, setPopupId] = useState(null);

  const closePopup = () => setPopupOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = getData();
      setData(response);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const addItem = async () => {
    const id = Date.now().toString(); // Simple unique ID
    try {
      const currentDate = getFormattedDate();
      const response = addData({ id, content: newItem, date: currentDate });
      setData(response);
      setNewItem("");
    } catch (error) {
      console.error("Error adding item", error);
    }

    function getFormattedDate() {
      const now = new Date();

      // 取得年份、月份、日期
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，所以要 +1
      const date = String(now.getDate()).padStart(2, '0');

      // 取得小時和分鐘
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');

      // AM/PM 判斷
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // 將 24 小時制轉為 12 小時制，且避免 0 點顯示為 0

      // 格式化時間字串
      return `${year}-${month}-${date} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }
  };

  const deleteItem = async (id) => {
    try {
      const currentData = deleteData(id);
      setData(currentData);
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const confirmPopup = async (id) => {
    setPopupOpen(true);
    setPopupId(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-5 items-center">
      <section className="w-[60%]">
        <div className="flex">
          <h1 className="text-3xl font-bold text-gray-800 mb-5 mr-5">Daily Record</h1>
          <ExportJsonToExcel jsonData={data} fileName="diary-all" buttonName='Export To Excel' />
        </div>
        <div className="flex space-x-3 mt-5 mb-5">
          <textarea
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
          </textarea>
          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            <MdOutlineAddCircleOutline />
          </button>
        </div>
        <label htmlFor="">filter: </label>
        <input
          type="text"

          onChange={(e) => setFilterText(e.target.value)}
          placeholder="keyword"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <ul className="w-full mt-5 bg-white shadow rounded-lg divide-y divide-gray-200">
          {data.filter(item => {
            return item?.content?.includes(filterText) || item?.date?.includes(filterText) || filterText == ""
          }).map((item) => (
            <li key={item.id} className="flex flex-wrap justify-between items-center p-4">

              <div className="w-full flex justify-between mb-2">
                <span className="text-gray-700" >{item.date}</span>
                <button
                  onClick={() => confirmPopup(item.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <MdOutlineRemoveCircleOutline />
                </button>
              </div>


              <span className="text-gray-700">{item.content}</span>
            </li>
          ))}
        </ul>
      </section>
      <Popup isOpen={isPopupOpen} popupId={popupId} closePopup={closePopup} callBack={deleteItem} title={'Confirm to delete this item?'} />
    </div>
  );
};

export default App;
