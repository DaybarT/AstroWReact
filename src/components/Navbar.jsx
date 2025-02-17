import React, { useState } from "react";

export default function Navbar({
  setSession,
  setData,
  setEdit,
  setAdd,
  setDel,
}) {
  const goTask = (value) => {
    if (value === "edit") {
      setEdit(true);
      setAdd(false);
      setDel(false);
    }
    if (value === "add") {
      setAdd(true);
      setEdit(false);
      setDel(false);
    }
    if (value === "delete") {
      setEdit(false);
      setAdd(false);
      setDel(true);
    }
    if (value === "home") {
      setEdit(false);
      setAdd(false);
      setDel(false);
    }
  };

  const off = () => {
    setEdit(false);
    setAdd(false);
    setDel(false);
    setData(false);
    setSession(false);
  };

  const buttonContainerStyle = {
    top: "20px",
    display: "flex",
    backgroundColor: "rgb(13, 83, 4)",
    width: "150px",
    height: "40px",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: "10px",
    transition: "all 0.5s",
  };

  const buttonContainerHoverStyle = {
    ...buttonContainerStyle,
    width: "170px",
  };

  const buttonStyle = {
    outline: "none",
    border: "none",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    transition: "all ease-in-out 0.3s",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    transform: "translateY(-3px)",
  };

  const iconStyle = {
    fontSize: "20px",
  };

  return (
    <div
      style={buttonContainerStyle}
      onMouseEnter={(e) =>
        (e.currentTarget.style.width = buttonContainerHoverStyle.width)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.width = buttonContainerStyle.width)
      }
    >
      <button
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = buttonHoverStyle.transform)
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        onClick={() => goTask("home")}
      >
        <svg
          style={iconStyle}
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 1024 1024"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
        </svg>
      </button>

      <button
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = buttonHoverStyle.transform)
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        onClick={() => goTask("add")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
      </button>

      <button
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = buttonHoverStyle.transform)
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        onClick={() => goTask("edit")}
      >
        <svg
          style={iconStyle}
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 700 700"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
        </svg>
      </button>

      <button
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = buttonHoverStyle.transform)
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        onClick={() => goTask("delete")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 12h12"
          ></path>
        </svg>
      </button>

      <button
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = buttonHoverStyle.transform)
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        onClick={() => off()}
      >
        <svg
          style={iconStyle}
          stroke="currentColor"
          fill="none"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 12h-9.5m7.5 3l3-3-3-3m-5-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h5a2 2 0 002-2v-1"
          />
        </svg>
      </button>
    </div>
  );
}
