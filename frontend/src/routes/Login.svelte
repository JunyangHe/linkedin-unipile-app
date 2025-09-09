<script>
  import { navigate } from 'svelte-routing';
  import { userId } from '../user.js';

  let username = '';
  let password = '';
  let error = '';
  let loading = false;
  let isSignUp = false;

    // Username and password rules
    function validate(username, password) {
        const usernameRule = /^[a-zA-Z0-9]{4,}$/; // at least 4 chars, letters/numbers only
        const passwordRule = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
        if (!usernameRule.test(username)) {
            return "Username must be at least 4 characters and contain only letters and numbers.";
        }
        if (!passwordRule.test(password)) {
            return "Password must be at least 6 characters and contain a letter, a number, and a special character.";
        }
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        error = '';
        loading = true;
        const validationError = validate(username, password);
        if (validationError) {
        error = validationError;
        loading = false;
        return;
        }
        try {
        const res = await fetch(`http://localhost:3001/auth/${isSignUp ? 'signup' : 'signin'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            userId.set(username);
            alert($userId);
            navigate('/Connect');
        } else {
            error = data.error || 'Sign in failed';
        }
        } catch (err) {
            alert(err);
        error = 'Network error';
        }
        loading = false;
    }
</script>

<section class="signin-container">
  <div class="signin-box">
    <a href="/" class="logo-link-centered">
      <img src="/figs/flyx_ai_logo.jpeg" alt="Flyx AI Logo" class="logo-centered" />
    </a>
    <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
    <form on:submit|preventDefault={handleSubmit} class="signin-form">
      <div class="input-group">
        <label for="username">Username</label>
        <input id="username" type="text" bind:value={username} required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} required />
      </div>
      <button type="submit" class="signin-btn" disabled={loading}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      {#if error}
        <p class="error">{error}</p>
      {/if}
    </form>
    <div class="toggle-link">
      {#if isSignUp}
        <span>Already have an account? <a href="#" on:click={() => { isSignUp = false; error = ''; }}>Sign In</a></span>
      {:else}
        <span>Don't have an account? <a href="#" on:click={() => { isSignUp = true; error = ''; }}>Sign Up</a></span>
      {/if}
    </div>
    {#if isSignUp}
      <div class="rules">
        <strong>Username:</strong> At least 4 characters, letters and numbers only<br>
        <strong>Password:</strong> At least 6 characters, must contain a letter, a number, and a special character.
      </div>
    {/if}
  </div>
</section>

<style>
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
  .signin-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }
  .signin-box {
    background: #fff;
    border-radius: 8px;
    padding: 32px 24px;
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .signin-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .input-group {
    margin-bottom: 16px;
    width: 100%;
  }
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 1rem;
    color: #444;
    font-weight: 500;
  }
  input[type="text"], input[type="password"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5da;
    border-radius: 4px;
    font-size: 1rem;
  }
  .signin-btn {
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
  }
  .signin-btn:disabled {
    background: #b2b2b2;
    cursor: not-allowed;
  }
  .error {
    color: #d73a49;
    margin-top: 10px;
    font-size: 0.95rem;
    text-align: center;
  }
  .toggle-link {
    margin-top: 18px;
    font-size: 0.98rem;
    color: #444;
  }
  .toggle-link a {
    color: #0366d6;
    text-decoration: underline;
    cursor: pointer;
  }
  .rules {
    margin-top: 18px;
    font-size: 0.95rem;
    color: #555;
    background: #f6f8fa;
    border-radius: 4px;
    padding: 10px;
    width: 100%;
    text-align: left;
  }
</style>