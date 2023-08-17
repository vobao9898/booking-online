import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
            <ToastContainer pauseOnFocusLoss={false} limit={1} theme="colored"/>
            <RouterProvider router={router}></RouterProvider>
        </>
    );
}

export default App;
