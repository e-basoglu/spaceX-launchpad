import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Launchpad {
  id: string;
  name: string;
  region: string;
  images?: {
    large: string[];
  };
  launches?: string[];
}

const App = () => {
  const [launchpads, setLaunchpads] = useState<Launchpad[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(5);
  const [filter, setFilter] = useState<string>('');

  // Fetch launchpad data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<Launchpad[]>('https://api.spacexdata.com/v4/launchpads');
      console.log('Data fetched successfully:', response.data);
      setLaunchpads(response.data);
    };
    fetchData();
  }, []);

  // Filter launchpads based on name and region
  const filteredLaunchpads = launchpads.filter((launchpad) => {
    const loweredFilter = filter.toLowerCase();
    return (
      launchpad.name.toLowerCase().includes(loweredFilter) ||
      launchpad.region.toLowerCase().includes(loweredFilter)
    );
  });

  // Get current page launchpads for rendering
  const paginatedLaunchpads = filteredLaunchpads.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle pagination changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordsPerPage(parseInt(event.target.value, 10));
  };

  // Handle filter input change
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  // Function to get Wikipedia link based on launchpad name
  const getWikipediaLink = (name: string) => {
    const links: { [key: string]: string } = {
      'VAFB SLC 3W': 'https://en.wikipedia.org/wiki/Vandenberg_Space_Launch_Complex_3',
      'CCSFS SLC 40': 'https://en.wikipedia.org/wiki/Cape_Canaveral_Space_Launch_Complex_40',
      'STLS': 'https://en.wikipedia.org/wiki/SpaceX_Starbase',
      'Kwajalein Atoll': 'https://en.wikipedia.org/wiki/Omelek_Island',
      'VAFB SLC 4E': 'https://en.wikipedia.org/wiki/Vandenberg_Space_Launch_Complex_4',
      'KSC LC 39A': 'https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39A',
    };
    return links[name] || '#';
  };

  return (
    <div className="container">
      <h1 className="my-4 center">SpaceX Launchpads</h1>

      {/* Filter Input */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by name or region"
        value={filter}
        onChange={handleFilterChange}
      />

      {/* Launchpad List */}
      {paginatedLaunchpads.map((launchpad) => (
        <div key={launchpad.id} className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">{launchpad.name}</h2>
            <p className="card-text">Region: {launchpad.region}</p>
            <div className="image-container">
              <img
                src={launchpad.images?.large[0]}
                className="card-img-top"
                alt={launchpad.name}
              />
            </div>
            <h3 className="mt-3">Launches</h3>
            <ul className="list-group">
              {launchpad.launches?.map((launch, index) => (
                <li key={index} className="list-group-item">
                  {launch}
                </li>
              ))}
            </ul>
            <a
              href={getWikipediaLink(launchpad.name)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary mt-3"
            >
              Wikipedia Link
            </a>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="text-center">
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredLaunchpads.length / recordsPerPage)}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === Math.ceil(filteredLaunchpads.length / recordsPerPage)}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <p className="text-muted mt-2">Adjust the number of launchpads per page:</p>
      {/* Records per page dropdown */}
      <select
        className="form-select mt-1 mb-4 center"
        value={recordsPerPage}
        onChange={handleRecordsPerPageChange}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
    </div>
    </div>
  );
};

export default App;
