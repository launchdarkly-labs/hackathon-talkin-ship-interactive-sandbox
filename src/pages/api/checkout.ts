import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerClient } from '../../utils/ld-server';
import { LDContext } from 'launchdarkly-node-server-sdk';
import { v4 as uuidv4 } from 'uuid';
import { getCookies, getCookie, setCookie, deleteCookie, CookieValueTypes } from 'cookies-next';
import { createCheckoutForStripe } from '@/utils/checkout-helper';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


/************************************************************************************************

	This file uses the `migrateToStripeApi` feature flag in LaunchDarkly enable the Stripe API communication
	for the billing component. 

	User context is rendered from the 'ldcontext' cookie which gets set during login. It is decoded
	into a JSON object below

	This file also contains the error return for when the `updatedBillingUi` flag is enabled but not the 
	`migrateToStripeApi` flag

*************************************************************************************************
*/

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {

	const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
	const clientContext: any = getCookie("ldcontext", { req, res });

	let migrateToStripeApi;
	let jsonObject

	if (clientContext == undefined) {
		jsonObject = {
			key: uuidv4(),
			user: "Anonymous"
		}
	} else {
		const json = decodeURIComponent(clientContext);
		jsonObject = JSON.parse(json);
	}

	/************************************************************************************************
	* There is a lot of missing API code here, 
	* retrieve the code from "Migrating Technologies with LaunchDarkly - Fixing Our API Code", Step 2
	*************************************************************************************************/
	//in this code, we are first retrieving the value for the enableStripe flag,
// then, if it returns true, running a function that creates a checkout session in stripe.
//If you want to see how that works, take a look at the `/src/utils/checkout-helpers.ts` file.

if (req.method === 'POST') {
		createCheckoutForStripe(req, res)
}
if (req.method === 'GET') {
			res.send("You are good to go!");
}
	/*************************************************************************************
		* Put the replacement code up above
		*************************************************************************************/
}
