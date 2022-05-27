<script context="module">
    export async function load({ session }) {
        if (session.authenticated) {
            return {
                status: 302,
                redirect: "/creator/"
            }
        }

        return {}
    }
</script>
<script lang="ts">
    import ErrorBlock from "$lib/components/ErrorBlock.svelte";
    import axios from "axios";

    let errors: string[] = [];

    let name: string = "";
    let password: string = "";

    async function login() {
        if (!name) {
            errors = ["You can't leave the name field empty."]
            return;
        }

        if (!password) {
            errors = ["You can't leave the password field empty."]
            return;
        }

        axios.post('/api/auth/login', { name: name, secret: password }).then(result => {
            if (result.status === 204) {
                setTimeout(() => {
                    window.location.replace('/creator/')
                }, 500);
            }
        }).catch(error => {
            let tempErrors = []
            if (error.response) {
                if (error.response.status === 400) {
                    tempErrors.push("Invalid name or password, please try again.")
                } else {
                    tempErrors.push("Failed to request post information, received " + error.response.status + " with content " + error.response.data.error + "");
                }
            } else if (error.request) {
                tempErrors.push("An internal error occurred while trying to request post information.");
            } else {
                tempErrors.push(error.message)
            }

            errors = tempErrors
            console.log(error)
        })
    }
</script>

{#if errors.length > 0}
    {#each errors as error}
    <ErrorBlock message="{error}"></ErrorBlock>
    {/each}
{/if}
<div class="flex flex-col gap-4">
    <hr>
    <div>
        <h2 class="text-2xl font-bold monst uppercase">CREATOR <span class="inverse mix-blend-lighten">DASHBOARD</span></h2>
        <p class="text-lg opensans">In a land full of chaos, a kingdom must place a gate to prevent the chaos from entering.</p>
    </div>
    <div class="flex flex-col gap-2">
        <input type="text" class="outline-none opensans border p-4 duration-[250ms] dark:bg-black dark:focus:bg-white dark:focus:text-black focus:bg-black focus:text-white" placeholder="Administrator Name" bind:value={name}/>
        <input type="password" class="outline-none opensans border p-4 duration-[250ms] dark:bg-black dark:focus:bg-white dark:focus:text-black focus:bg-black focus:text-white" placeholder="Secret Key" bind:value={password}/>
        <button class="bg-black text-white dark:bg-white dark:text-black p-4 mt-2 md:max-w-[10rem]" on:click={login}>Login</button>
    </div>
</div>