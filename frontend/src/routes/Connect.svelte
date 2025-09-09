<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { userId, accountId } from '../user.js';

    let username = '';
    let password = '';
    let error = '';
    let li_at = '';
    let li_a = '';
    let method = 'credentials';

    // Redirect to sign in if user is not signed in
    onMount(() => {
        if (!$userId) {
            navigate('/');
        }
    });

    async function handleLinkedinAuth(e) {
        e.preventDefault();
        // error = '';
        // loading = true;

        try {
            const res = await fetch('/auth/connectlinkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: $userId, username, password}),
                credentials: "include",
            });
            const data = await res.json();

            if (data.success) {
                await accountId.set(data.account_id);
                navigate('/Home');

            } else {
                error = data.error || 'Login failed';
            }

            loading = false;

        } catch (err) {
            error = 'Network error';
        }
    };


    async function handleCookieAuth(e) {
        e.preventDefault();
        // error = '';
        // loading = true;
        try {
            const res = await fetch('/auth/connectlinkedincookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: $userId, li_at, li_a }),
                credentials: "include",
            });
            const data = await res.json();
            
            if (data.success) {
                await accountId.set(data.account_id);
                error = '';
                navigate('/Home');

            } else {
                error = data.error || 'Login failed';
            }

            loading = false;

        } catch (err) {
            error = 'Network error';
        }
    }

    function signOut() {
        userId.set(null);
        accountId.set(null);
        username = '';
        password = '';
        li_at = '';
        li_a = '';
        error = '';
        navigate('/');
    }

</script>

<section class="home-container">
  <div class="info-box">
    <h2>Sign in to LinkedIn</h2>
    <div class="method-tabs">
      <button
        class:active-tab={method === 'credentials'}
        on:click={() => method = 'credentials'}
      >Credentials</button>
      <button
        class:active-tab={method === 'cookies'}
        on:click={() => method = 'cookies'}
      >Cookies</button>
    </div>
    
    <!-- Credential login -->
    {#if method === 'credentials'}
      <form on:submit|preventDefault={handleLinkedinAuth} class="auth-form">
      <div class="input-group">
        <label for="username">Email</label>
        <input id="username" type="text" bind:value={username} required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} required />
      </div>

      <button type="submit" class="unipile-btn">Connect</button>
      {#if error}
        <p class="error">{error}</p>
      {/if}
    </form>

    <!-- Cookie login -->
    {:else}
      <form on:submit|preventDefault={handleCookieAuth} class="auth-form">
        <div class="input-group">
          <label for="li_at">Enter your li_at value</label>
          <input id="li_at" type="text" bind:value={li_at} placeholder="li_at value" />
        </div>
        <div class="input-group">
          <label for="li_a">Enter your li_a value (optional)</label>
          <input id="li_a" type="text" bind:value={li_a} placeholder="li_a value (optional)" />
        </div>
        <button type="submit" class="unipile-btn">Login</button>
        {#if error}
          <p class="error">{error}</p>
        {/if}
      </form>
    {/if}
    <div class="signout-btn-wrapper">
      <button class="signout-btn" on:click={signOut}>Sign Out</button>
    </div>
  </div>
</section>

<style>
  :global(html), :global(body) {
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    background: #f6f8fa;
  }
  .logo-link-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 18px;
    width: 100%;
  }
  .logo-centered {
    max-width: 150px;
    height: auto;
    display: block;
  }
  .home-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 40px;
    margin-top: 40px;
  }
  .info-box {
    background: #fff;
    border-radius: 8px;
    padding: 32px 24px;
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  .info-box h2 {
    margin-bottom: 20px;
    color: #222;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
  .method-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  .method-tabs button {
    background: #f6f8fa;
    border: none;
    border-radius: 20px;
    padding: 8px 18px;
    font-size: 1rem;
    color: #444;
    cursor: pointer;
    font-weight: 600;
    outline: none;
    transition: background 0.2s;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  .method-tabs button.active-tab {
    background: #e1e9f7;
    color: #0366d6;
    box-shadow: 0 2px 8px rgba(3,102,214,0.07);
  }
  .input-group {
    margin-bottom: 16px;
    width: 100%;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 1rem;
    color: #444;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 500;
  }
  input[type="text"], input[type="password"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5da;
    border-radius: 4px;
    font-size: 1rem;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  .auth-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  .unipile-btn {
    margin: 16px auto 0 auto;
    padding: 8px 32px;
    background: #0077b5;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    width: auto;
    display: block;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  .unipile-btn:disabled {
    background: #b2b2b2;
    cursor: not-allowed;
  }
  .error {
    color: #d73a49;
    margin-top: 10px;
    font-size: 0.95rem;
    text-align: center;
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  }
  .signout-btn-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 18px;
  }
  .signout-btn {
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

</style>