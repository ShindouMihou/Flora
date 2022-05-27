<script context="module">
    export async function load({ session }) {
        if (!session.authenticated) {
            return {
                status: 302,
                redirect: "/creator/login",
            };
        }

        return {};
    }
</script>

<script>
import FloraEditor from "$lib/components/editor/FloraEditor.svelte";
import { page } from "$app/stores";

</script>


<FloraEditor postId={$page.params.id}></FloraEditor>
