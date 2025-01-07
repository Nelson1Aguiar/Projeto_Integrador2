import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SelectionForm from "./assets/SelectionForm";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/selection-form" element={<SelectionForm setPage={setPage} user={user}/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
