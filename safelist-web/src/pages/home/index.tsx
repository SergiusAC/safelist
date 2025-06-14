import { Link } from "react-router-dom";

const HomePage = () => {
  return <>
    <div className="hero">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold">Safelist</h1>
          <p className="pt-6">
            Safelist is a browser-based application for secure note management. <br/>
          </p>
        </div>
      </div>
    </div>
    <div className="flex justify-center">
      <div className="card w-105">
        <div className="card-body">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Features</h2>
          </div>
          <ul className="mt-4 flex flex-col gap-2 text-xs">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>Client-side encryption using <b>Web Crypto API</b></span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>Data is stored in <b>Local Storage</b> and <b>IndexedDB</b></span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>Optional cloud drive synchronization</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>Data export/import</span>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>
                Open-source code 
                (<a target="_blank" rel="noopener noreferrer" href="https://github.com/SergiusAC/safelist" className="text-blue-600 underline">Github</a>)
              </span>
            </li>
          </ul>
          <div className="mt-6">
            <Link to="/vault" className="btn btn-primary btn-block">Start</Link>
          </div>
        </div>
      </div>
    </div>
  </>
};

export default HomePage;