<template>

    <div v-if="loaded" class="information">
        <h1>Compras Realizadas</h1>

        <ul id="v-for-object" class="listaCompras">
            <li class="carritos" v-for:="item in compras" v-on:click="describeCart(item.idCarrito)">
                <a>
                    <h2 id="costoCarrito">Costo total: {{ item.facturas[0].precioTotal }}</h2>
                    <h3 id="fechaCarrito">Fecha: {{ item.facturas[0].fecha }}</h3>
                </a>
            </li>
        </ul>

    </div>

</template>


<script>
import jwt_decode from "jwt-decode";
import axios from 'axios';

export default {
    name: "Carrito",

    data: function(){
        return {
            compras: null,
            loaded: false,
        }
    },

    methods: {

        getData: async function () {

            if (localStorage.getItem("accessToken") === null || localStorage.getItem("refreshToken") === null) {
                alert("Ocurrio un error");
                console.log("Acas")
                this.$emit('logOut');
                return;
			}

            await this.verifyToken();
            
            let token = localStorage.getItem("accessToken");
            let userId = jwt_decode(token).idUser.toString();

            axios.get(`https://c3g10-backend.herokuapp.com/user/purchases/${userId}/`, {headers: {'Authorization': `Bearer ${token}`}})
                .then((result) => {
                    if(result.data.data.length == 0){
                        alert("No haz realizado compras en nuestra tienda. Te invitamos a que agregues algunos productos"+
                        " a tu carrito y realices tu primera adquisición");
                        window.location.href = window.location.href;
                    }else{
                        this.compras = result.data.data;
                        console.log(result.data.data);
                        this.loaded = true;
                    }
                })
                .catch((err) => {

                    if(err.response.data.info.split(". ")[2] == "No Productos"){
                        alert("No hay productos en tu carrito. Por favor añade los que quieras");
                        window.location.href = window.location.href;
                    }else{
                        alert("Ocurrio un error");
                        console.log(err.response);
                        console.log("Aca");
                        this.$emit('logOut');
                    }

                });

        },

        verifyToken: function () {
            let token = localStorage.getItem("refreshToken");
            return axios.post("https://c3g10-backend.herokuapp.com/user/refresh/", {}, {headers: {'Authorization': `Bearer ${token}`}})
				.then((result) => {
					localStorage.setItem("accessToken", result.data.accessToken);
				})
				.catch((err) => {
                    alert("Ocurrio un error");
                    console.log(err);
                    console.log("Alla")
					this.$emit('logOut');
				});
        },

        describeCart: function(idCarrito){
            console.log("Vamos a listar los productos del carrito "+idCarrito);
            this.$emit("loadVerCompra", idCarrito);
        }

    },

    created: async function(){
        this.getData();
    },
}
</script>


<style>
    .information{
        margin: 0;
        padding: 0%;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;    
        align-items: center;
    }

    .information h1{
        font-size: 60px;
        color: black;
    }

    .information h2{
        font-size: 40px;
        color: black;
    }

    .listaCompras{
        list-style: none;
        width: 50%;
    }

    .carritos{
        background: #4ac8cf67;
        border-radius: 20px;
        margin-bottom: 40px;
        width: 100%;
        min-height: 100px;
        height: auto;
        cursor: pointer;
    }

    .carritos a{
        display: flex;
        justify-items: center;
        align-items: center;
        text-decoration: none;
        color: black;
    }

    .carritos h2{
        margin-top: 26px;
        padding-left: 20px;
        width: auto;
        max-width: 620px;
        overflow: hidden;
    }

    .carritos h3{
        font-size: 25px;
        margin-left: 35%;
        display: flex;
        justify-content: left;
        align-items: center;
        position: absolute;
    }

</style>