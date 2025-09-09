<script>
    import { onMount } from 'svelte';
    import { accountId, userId, accounts } from '../user.js';
    import { navigate } from 'svelte-routing';

    let error = '';
    let loading = true;

    onMount(async () => {
        if ($accountId === null) {
            navigate('/Connect');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/accounts/getaccounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: $userId }),
                credentials: 'include'
            });

            const data = await res.json();
            if (data.accounts) {
                accounts.set(data.accounts);
            } else {
                error = data.error || 'Failed to fetch accounts';
            }
        } catch (err) {
            error = 'Network error';
        }
        loading = false;
    });

    function disconnectLinkedin() {
        // Clear all credentials and stores
        accountId.set(null);
        accounts.set([]);

        navigate('/Connect');
    }

</script>

<main class="accounts-main">
    <div class="accounts-container">
        <h2>Current Account ID:</h2>
        {#if $accountId}
            <div class="current-account-id">{$accountId}</div>
        {/if}
            <h2>Your Linked Accounts</h2>
        {#if loading}
            <p>Loading...</p>
        {:else if error}
            <p class="error">{error}</p>
        {:else if accounts.length === 0}
            <p>No LinkedIn accounts found.</p>
        {:else}
            <ul class="account-list">
                {#each $accounts as account}
                <li>
                    <span class="account-id">{account.account_id}</span>
                    <span class="provider">{account.provider}</span>
                </li>
                {/each}
            </ul>
        {/if}

        <div class="signout-btn-wrapper">
            <button class="signout-btn" on:click={disconnectLinkedin}>Go Back</button>
        </div>
    </div>
</main>

<style>
    .signout-btn-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 24px;
    }
    .signout-btn {
        align-self: flex-end;
        margin-bottom: 12px;
        padding: 6px 18px;
        background: #e74c3c;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        transition: background 0.2s;
    }
    .signout-btn:hover {
        background: #c0392b;
    }
    .accounts-main {
        min-height: 100vh;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .accounts-container {
        background: #fff;
        padding: 32px 28px;
        border-radius: 10px;
        width: 350px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .current-account-id {
        font-size: 0.95rem;
        color: #111;
        font-weight: 500;
        margin-bottom: 18px;
        font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }
    h2 {
        margin-bottom: 24px;
        color: #0366d6;
        font-size: 1.5rem;
        font-weight: 700;
        font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }
    .account-list {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
    }
    .account-list li {
        padding: 12px 0;
        border-bottom: 1px solid #e1e4e8;
        display: flex;
        justify-content: space-between;
        font-size: 1rem;
        font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }
    .account-id {
        color: #222;
        font-weight: 600;
    }
    .provider {
        color: #888;
        font-size: 0.95rem;
        font-style: italic;
    }
    .error {
        color: #d73a49;
        margin-top: 10px;
        font-size: 0.98rem;
        text-align: center;
        font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }
    </style>