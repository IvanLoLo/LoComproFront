<template>

    <div v-if="loaded" class="information">
        <h1>Carrito de compras</h1>
        <h2>Total: {{total}}</h2>

        <ul id="v-for-object" class="listaCarritoComprado">
            <li class="productoCarritoComprado" v-for:="item in carrito" v-on:click="goToProduct(item.idProducto)">
                <a>
                    <h2>{{ item.nombre }}</h2>
                    <h3>${{ item.precio }}</h3>
                    <div class="imageCarritoComprado">
                        <img v-bind:src="'https://locomproback.onrender.com/product/image/'+item.productImage">
                    </div>
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
            carrito: null,
            loaded: false,
            total: null,
        }
    },

    methods: {

        changeTotal: function() {
            this.total = 0;
            for(let producto in this.carrito){
                if(this.carrito[producto].cantidad > this.carrito[producto].stock) this.carrito[producto].cantidad = this.carrito[producto].stock;
                this.total += (this.carrito[producto].precio * this.carrito[producto].cantidad);
            }
        },

        getData: async function () {

            if (localStorage.getItem("accessToken") === null || localStorage.getItem("refreshToken") === null) {
                alert("Ocurrio un error");
                console.log("Acas")
                this.$emit('logOut');
                return;
			}

            await this.verifyToken();
            
            let token = localStorage.getItem("accessToken");
            console.log("token");
            console.log(token);
            let userId = jwt_decode(token).idUser.toString();

            let idCarrito = window.location.href.split("/factura/")[1];

            axios.get(`https://locomproback.onrender.com/user/purchase/${userId}/${idCarrito}/`, {headers: {'Authorization': `Bearer ${token}`}})
                .then((result) => {
                    console.log("Info", result);
                    this.carrito = result.data.productos;
                    this.changeTotal();
                    this.loaded = true;
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
            return axios.post("https://locomproback.onrender.com/user/refresh/", {}, {headers: {'Authorization': `Bearer ${token}`}})
				.then((result) => {
                    console.log("Refrescado", result);
					localStorage.setItem("accessToken", result.data.accessToken);
				})
				.catch((err) => {
                    alert("Ocurrio un error");
                    console.log(err);
                    console.log("Alla")
					this.$emit('logOut');
				});
        },

        goToProduct: function(producto){
            console.log("Pulsando nombre "+producto);
            this.$emit("productSelected", producto);
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

    .listaCarritoComprado{
        list-style: none;
        width: 60%;
    }

    .productoCarritoComprado{
        background: #4ac8cf67;
        border-radius: 20px;
        margin-bottom: 20px;
        width: 100%;
        min-height: 100px;
        height: auto;
        cursor: pointer;
    }

    .productoCarritoComprado a{
        display: flex;
        justify-items: center;
        align-items: center;
        text-decoration: none;
        color: black;
    }

    .productoCarritoComprado h2{
        margin-top: 26px;
        padding-left: 20px;
        width: auto;
        max-width: 620px;
        overflow: hidden;
    }

    .productoCarritoComprado h3{
        font-size: 25px;
        margin-left: 36%;
        display: flex;
        justify-content: left;
        align-items: center;
        position: absolute;
    }

    .imageCarritoComprado{
        width: 15%;
        height: 100px;
        margin-top: -5px;
        margin-left: 46%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
    }

    .imageCarritoComprado img{
        height: 85%;
        max-width: 170px;
    }

    

</style>