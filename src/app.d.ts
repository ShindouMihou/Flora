/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	declare namespace App {
		interface Locals {
			authenticated: boolean
		}
		// interface Platform {}
		interface Session  {
			authenticated: boolean
		}
		// interface Stuff {}
	}	
}