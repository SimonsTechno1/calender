/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import './App.css';

const auctionData = [
  { date: 'Jul 1st', event: 'North Carolina Public Foreclosure Sale', id: 'E-26245', type: 'Foreclosure', assets: 18 },
  // ... (other auction data)
];

const App = () => {
  const [filters, setFilters] = useState({
    date: null,
    state: '',
    assetType: '',
    buyingType: '',
    hidePast: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // State for showing filters on mobile

  const itemsPerPage = 25;
  const totalItems = auctionData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: date
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredData = auctionData.filter((item) => {
    const isPastEvent = new Date(item.date) < new Date();
    if (filters.hidePast && isPastEvent) return false;

    const dateMatch = filters.date ? new Date(item.date).toDateString() === filters.date.toDateString() : true;
    const stateMatch = filters.state ? item.event.includes(filters.state) : true;
    const assetTypeMatch = filters.assetType ? item.type.includes(filters.assetType) : true;
    const buyingTypeMatch = filters.buyingType ? item.buyingType === filters.buyingType : true;

    return dateMatch && stateMatch && assetTypeMatch && buyingTypeMatch;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="app">
      <h1>Real Estate Auction Calendar</h1>
      <button className="view-filters-btn" onClick={toggleFilters}>
        {showFilters ? 'Hide Filters' : 'View Filters'}
      </button>
      <div className={`filters ${showFilters ? 'active' : ''}`}>
        <div className="datepicker-container">
          <DatePicker
            selected={filters.date}
            onChange={handleDateChange}
            placeholderText="MM/DD/YYYY"
            className="filter-input"
          />
          <FaCalendarAlt className="calendar-icon" />
        </div>
        <select
          name="state"
          value={filters.state}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select State</option>
          {/* Add all states here */}
        </select>
        <select
          name="assetType"
          value={filters.assetType}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Asset Type</option>
          <option value="Foreclosure">Foreclosure</option>
        </select>
        <select
          name="buyingType"
          value={filters.buyingType}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Buying Type</option>
        </select>
        <label className="hide-past-label">
          <input
            type="checkbox"
            name="hidePast"
            checked={filters.hidePast}
            onChange={handleFilterChange}
          />
          Hide past events
        </label>
      </div>
      <div className="auction-table">
        <div className="header">
          <div className="cell cell-dates">Dates - Type</div>
          <div className="cell cell-event">Event Name</div>
          <div className="cell cell-assets">Asset Type - Total Assets</div>
        </div>
        {paginatedData.map((item, index) => (
          <div className="row" key={index}>
            <div className="cell cell-dates">{item.date}</div>
            <div className="cell cell-event">
              <a href="#">{item.event} ({item.id})</a>
            </div>
            <div className="cell cell-assets">
              {item.type}<br />Assets: {item.assets}
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <span>Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results</span>
        <div>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={currentPage === pageNumber ? 'active' : ''}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
