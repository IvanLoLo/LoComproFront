<template>
  <div id="app" class="app">

    <div class="header">
      <img id="icon" src="https://c3g10-backend.herokuapp.com/product/image/LoComproLogo.png" alt="Logo" v-on:click="loadProducts">
      <nav>
        <button v-if="is_auth" v-on:click="loadAccount"> Carrito </button>
        <button v-if="is_auth" v-on:click="loadPurchase"> Compras </button>
        <button v-if="is_auth && admin" v-on:click="loadFormProducto('crear')"> Nuevo Producto </button>
        <button v-if="is_auth" v-on:click="logOut"> Cerrar Sesión </button>
        <button v-if="!is_auth" v-on:click="loadLogIn" > Iniciar Sesión </button>
        <button v-if="!is_auth" v-on:click="loadSignUp" > Registrarse </button>
      </nav>
    </div>
    
    <div class="main-component">
      <router-view  
        v-on:completedLogIn="completedLogIn"
        v-on:completedSignUp="completedSignUp"
        v-on:logOut="logOut"
        v-on:productSelected="productSelected"
        v-on:needToLogIn="loadLogIn"
        v-on:loadForm="loadFormProducto"
        v-on:loadVerCompra="loadVerCompra"
      >
      </router-view>
    </div>    
    
    <footer class="footer">
      <h2 onclick='window.scrollTo({top: 0, behavior: "smooth"});'>LO COMPRO</h2>
    </footer>

  </div>
</template>




<script>
import jwt_decode from "jwt-decode";

export default {
  name: 'App',

  data: function(){
      return{
        is_auth: false,
        admin: false,
      }
  },

  components: {
  },

  methods:{
    verifyAuth: function() {
      this.is_auth = localStorage.getItem("isAuth") || false;

      try{
          let token = localStorage.getItem("accessToken");
          let userId = jwt_decode(token).idUser.toString();

          if(userId == 1) this.admin = true;
      }catch(e){
          this.admin = false;
      }
		
      this.$router.push({ name: "root" });
    },

    loadLogIn: function(){
      this.$router.push({name: "logIn"})
    },

    loadSignUp: function(){
      this.$router.push({name: "signUp"})
    },

    completedLogIn: function(data) {
			localStorage.setItem("isAuth", true);
			localStorage.setItem("email", data.email);
			localStorage.setItem("accessToken", data.accessToken);
			localStorage.setItem("refreshToken", data.refreshToken);
			this.verifyAuth();
    },

    completedSignUp: function(data) {
			alert("Registro Exitoso");
			this.completedLogIn(data);
    },

    productSelected: function(producto){
      console.log("Mandar a info del producto", producto);
      this.$router.push({ name: "producto", params: {producto}});
    },

    loadHome: function() {
      this.$router.push({ name: "home" });
    },

    loadAccount: function () {
			this.$router.push({ name: "carrito" });
		},

    loadProducts: function () {
			this.$router.push({ name: "root" });
		},

    loadFormProducto: function (action, producto) {
			this.$router.push({ name: "formProducto", params: {action, producto}});
		},

    loadPurchase: function () {
			this.$router.push({ name: "purchases" });
		},

    loadVerCompra: function (carrito) {
			this.$router.push({ name: "factura" , params: {idCarrito: carrito}});
		},

    logOut: function () {
			localStorage.clear();
			alert("Sesión Cerrada");
			this.verifyAuth();
      window.location.href = window.location.href;
		},

  },

  created: function(){
    this.verifyAuth()
  }

}
</script>






<style>

  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap');

  body{
    margin: 0;
    background-color: #c9faf35d;
  }

  .app{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .header{
    margin: 0%;
    padding: 0;
    width: 100%;
    height: 10vh; 
    min-height: 100px;

    background-color: #c7fcf48a;
    color: black;
    -webkit-box-shadow: 0px 0px 9px 3px rgba(41,41,41,.25);
    -moz-box-shadow: 0px 0px 9px 3px rgba(41,41,41,.25);
    box-shadow: 0px 0px 9px 3px rgba(41,41,41,.25);

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h1{
    width: 22%;
    text-align: right;
    cursor: pointer;
    font-size: 50px;
    margin-left: -570px;
    font-family: 'EB Garamond', serif;
    color: #2d8c91;
  }

  #icon{
    cursor: pointer;
    width: 240px;
    margin-left: 2%;
  }

  .header nav {
    height: 100%;
    width: 35%;

    display: flex;
    align-items: center;
    justify-content: right;

    font-size: 20px;
  }

  .header nav button{
    color: white;
    background: #4ac9cf;
    border: 1px solid #71C9CE;
    cursor: pointer;
    font-size: 15px;

    border-radius: 5px;
    padding: 10px 20px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .header nav button:hover{
    color: black;
    background: #a9eef1;
    border: 1px solid #4ac8cf23;
  }

  
  .main-component{
    min-height: 78vh;
    margin: 0%;
    padding: 0%;
  }

 /*
  .footer{
    margin: 0 0 0 0;
    padding: 0;
    width: 100%;
    height: 10vh;
    min-height: 100px;
    background-color: #283747;
    color: #E5E7E9;
  }

  .footer h2{
    width: 100%;
    height: 100%;
    
    display: flex;
    justify-content: center;
    align-items: center;
  }
  */

  .footer{
    position: relative;
    bottom: 0;
    background: #c7fcf48a;
    min-height: 68px;
    margin-top: 3%;

    -webkit-box-shadow: 0px 0px 9px 3px rgba(41,41,41,.25);
    -moz-box-shadow: 0px 0px 9px 3px rgba(41,41,41,.25);
    box-shadow: 0px 0px 9px 3px rgba(41,41,41,.25);
  }

  .footer h2{
    padding-left: 20px;
    cursor: pointer;
    font-family: 'Agency FB', serif;
    color: #2d8c91;
    margin: 12px 0 12px 0;
    font-size: 40px;
  }

</style>
