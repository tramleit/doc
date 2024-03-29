import React from 'react';
import ManagerSent from "@/Pages/Sent/ManagerSent.jsx";
import UserSent from "@/Pages/Sent/UserSent.jsx";
import CommonSent from "@/Pages/Sent/CommonSent.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head} from "@inertiajs/react";

const Index = ({
                   auth,
                   documents,
                   flash,
                   page,
                   searchTerm,
                   status,
                   dateDone,
                   startDate,
                   endDate,
                   is_controlled,
               }) => {
    const user = auth.user;
    return (
        <AuthenticatedLayout
            user={user}
        >
            <Head title={"Sent"}/>
            {user.role === 'management' && <ManagerSent/>}
            {user.role === 'user' && <UserSent
                documents={documents}
                page={page}
                searchTerm={searchTerm}
                status={status}
                dateDone={dateDone}
                startDate={startDate}
                endDate={endDate}
                is_controlled={is_controlled}
            />
            }
            {
                user.role === 'common' && <CommonSent
                    documents={documents}
                    page={page}
                    searchTerm={searchTerm}
                    status={status}
                    dateDone={dateDone}
                    startDate={startDate}
                    endDate={endDate}
                    is_controlled={is_controlled}
                />
            }
        </AuthenticatedLayout>
    );
};

export default Index;
