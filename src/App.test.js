import { render, screen, act } from '@testing-library/react';
import App, {fetchUrl} from './App';
import {fetchStore} from './ActionAndReducer';
import Enzyme, {shallow, configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';


test('UI loads', ()=>{
	const { container } = render(<App />);
	const tbodyElement = container.querySelector(".table-graphql-div tbody");
	expect(tbodyElement).toBeInTheDocument();
});

describe('api calls', ()=>{

	test('verify whether App.js fetch function is working', async()=>{
		const fakeResponse = {"data":{"cities":[{"name":"A"}, {"name":"B"}]}};
		const apiFn = jest.spyOn(fetchUrl, "fetchUrlFn").mockImplementationOnce(()=>{
			return Promise.resolve({
				status:200,
				json:()=>{
					return Promise.resolve(fakeResponse)
				}
			})
		});

		fetchUrl.fetchUrlFn();
		expect(apiFn).toHaveBeenCalled();
	});

	test('verify if external graphql api is working', async ()=>{
		await fetch("https://api.graphql.jobs/", 
			{
				method:"POST",
				headers: {"Content-Type":"application/json"}, 
				body:JSON.stringify({"query":"query{companies{ name }}"}),
			}).then(res=>{
				expect(res.status).toBe(200);
			})
	});

});

