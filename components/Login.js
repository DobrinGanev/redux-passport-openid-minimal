import React from 'react'
const Login = () => (
   <form method="POST" action="/authenticate">
     <p>Login using OpenID</p>
     <input name="openid_identifier" />
     <input type="submit" value="Login" />
   </form>
  )

export default Login;
