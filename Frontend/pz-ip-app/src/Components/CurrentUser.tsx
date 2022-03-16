import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { resolveReadonlyArrayThunk } from 'graphql';
import { get_current_user } from "./../Queries/queries";

const CurrentUser = ()  =>{
	const [currentUserInfo, setCurrentUserInfo] = useState<any>();

	useQuery(get_current_user, {
		onCompleted: (data) => {
		setCurrentUserInfo(data.me);
		},
		onError: (error) => {
		console.log(error)
		}
	})

    return(
        <div>
            {currentUserInfo ? <span className='mt-1'> Witaj, {currentUserInfo.username} 👋</span> : null}
        </div>
    );
   };

   export default CurrentUser;