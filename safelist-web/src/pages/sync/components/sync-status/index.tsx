import type React from "react";

interface SyncStatusComponentProps {
  syncEnabled: boolean;
  syncExpired: boolean;
}

const SyncStatusComponent: React.FC<SyncStatusComponentProps> = ({ syncEnabled, syncExpired }) => {
  if (syncExpired) {
    return <>
      <div className="inline-grid *:[grid-area:1/1]">
        <div className="status status-error animate-ping"></div>
        <div className="status status-error"></div>
      </div> (token expired, update settings)
    </>
  }
  if (syncEnabled) {
    return <>
      <div className="inline-grid *:[grid-area:1/1]">
        <div className="status status-success animate-ping"></div>
        <div className="status status-success"></div>
      </div> 
    </>
  } else {
    return <>
      <div className="inline-grid *:[grid-area:1/1]">
        <div className="status status-neutral"></div>
      </div>
    </>
  }
}

export default SyncStatusComponent;