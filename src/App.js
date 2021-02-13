
import './App.css';
import React, {useState, useEffect} from 'react';
import './index.css'
import {startFetch, finishFetch, failFetch, fetchStore} from './ActionAndReducer.js'
import ReactCountryFlag from "react-country-flag";


function populateTbodyForGraphQl(responseData){
	if(responseData.length !=0){
		let finalTbodyString = [];
		let cities = responseData.data.cities
		let counter = 0
		cities.map((data)=>{
			
			let jobCity = data.name;
			let jobCountry= data.country.name;
			let isoCode = data.country.isoCode;
			
			data.jobs.map((jobs)=>{
				counter+=1;

				let jobTitle = jobs.title;
				let applyUrl = jobs.applyUrl;
				let companyName = jobs.company.name;
				let websiteUrl = jobs.company.websiteUrl;
				let logo = jobs.company.logoUrl;
				let remote = jobs.remotes.length !=0 ? "Remote" : ""
				
				finalTbodyString.push(
					<tr>
						<td>{counter}</td>
						<td>
							<a href={applyUrl}>{jobTitle}</a>
						</td>
						<td>
							<a href={websiteUrl}>{companyName}</a>
						</td><td>{jobCity}</td>
						<td><ReactCountryFlag countryCode={isoCode} />{jobCountry}</td>
						<td>{remote}</td>
					</tr>
				);
			});

		});
		return finalTbodyString;
	}
}


export const fetchUrl = {
	async fetchUrlFn(url, method, headers, body){
		return fetch(url, {
			method:method,
			headers:headers,
			body:JSON.stringify(body),
		}).then(res=>res.json())
	}
}

function App() {
	const [finalResponse, setFinalResponse] = useState([])

	useEffect(()=>{
		
		fetchStore.dispatch(startFetch());

		let url = "https://api.graphql.jobs/";
		let method = "POST";
		let headers = {"Content-Type": "application/json"};
		let body = {
			"query": `
				query{
					cities{
						name,
						jobs{
							title,
							applyUrl,
							company{
								name,
								logoUrl,
								websiteUrl
							},
							remotes{
								name
							},
						},
						country{
							name,
							isoCode
						},
					}
				}`
		}
		fetchUrl.fetchUrlFn(url, method, headers, body).then((data)=>{
			fetchStore.dispatch(finishFetch(data));
		}).catch((err)=>{
			console.error(err);
			fetchStore.dispatch(failFetch(err));
		});
	},[]);


	fetchStore.subscribe(async()=>{
		if(fetchStore.getState().data !=null){
			await setFinalResponse(fetchStore.getState().data);
		}
	});

  return (
  	<div className="table-graphql-div">
  		
	    <table className="table table-bordered table-graphql">
	    	<thead>
	    		<tr>
	    			<th>Sr No</th>
	    			<th>Job Title</th>
	    			<th>Company</th>
	    			<th>City</th>
	    			<th>Country</th>
	    			<th>Remote Available</th>
	    		</tr>
	    	</thead>

	    	<tbody>
	    		{populateTbodyForGraphQl(finalResponse)}
	    	</tbody>
	    </table>
	 </div>
  );

}

export default App;
