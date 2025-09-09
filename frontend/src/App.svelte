<script>
  import { Router, Route, link } from 'svelte-routing';
  import Login from './routes/Login.svelte';
  import Connect from './routes/Connect.svelte';
  import Home from './routes/Home.svelte';
</script>

<main>
  <!-- <nav>
    <a use:link href="/home">Home</a>
    <a use:link href="/login">Login</a>
  </nav> -->
  <Router>
    <Route path="/" component={Login} />
    <Route path="/Connect" component={Connect} />
    <Route path="/Home" component={Home} />
  </Router>
</main>