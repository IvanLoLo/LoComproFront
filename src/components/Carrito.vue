<template>

    <div v-if="loaded" class="information">
        <h1>Carrito de compras</h1>
        <h2>Total: {{total}}</h2>

        <ul id="v-for-object" class="listaCarrito">
            <li class="productoCarrito" v-for:="item in carrito">
                <a>
                    <h2 v-on:click="goToProduct(item.idProducto)">{{ item.nombre }}</h2>
                    <h3>${{ item.precio }}</h3>
                    <div class="imageCarrito">
                        <img v-bind:src="'https://c3g10-backend.herokuapp.com/product/image/'+item.productImage">
                    </div>
                    <div class="controls">
                        <div class="cantidad">
                            Cantidad
                            <input type="number" min="1" v-bind:max="item.stock" v-model="item.cantidad" v-on:change="changeTotal()">    
                        </div>
                        <img id="deleteProduct" alt="Delete" src="https://cdn-icons-png.flaticon.com/512/75/75519.png"
                        v-on:click="deleteProducto(item.idProducto, item.nombre)">
                    </div>
                </a>
            </li>
        </ul>

        <button v-on:click="buyCart()">Comprar</button>

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

        buyCart: async function(){
            console.log("Comprando cosas");

            let confirmado = confirm(`¿Continuar con la compra de los productos de este carrito?`);
            if(!confirmado) return;

            await this.verifyToken();
            
            let token = localStorage.getItem("accessToken");
            console.log("token");
            console.log(token);
            let userId = jwt_decode(token).idUser.toString();

            axios.post(`https://c3g10-backend.herokuapp.com/user/checkout/${userId}/${this.total}`, {}, {headers: {'Authorization': `Bearer ${token}`}})
            .then(result => {
                alert("Muchas gracias por su compra. Vuelva pronto!");
                window.location.href = window.location.href;
            }).catch(err => {
                console.log("Error", err.response);
            });
            
        },

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
            let userId = jwt_decode(token).idUser.toString();

            axios.get(`https://c3g10-backend.herokuapp.com/user/cart/${userId}/`, {headers: {'Authorization': `Bearer ${token}`}})
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

        deleteProducto: async function(productoId, nombre){
            console.log("Borrando del carrito");
            let confirmado = confirm(`¿Está seguro que desea eliminar el producto "${nombre}" de su carrito?`);

            if(!confirmado) return;

            await this.verifyToken();
            
            let token = localStorage.getItem("accessToken");
            let userId = jwt_decode(token).idUser.toString();

            axios.delete(`https://c3g10-backend.herokuapp.com/user/cart/${userId}`, {headers: {'Authorization': `Bearer ${token}`}, data: {producto: productoId}})
            .then(result => {
                alert("Producto eliminado satisfactoriamente");
            }).catch(err => {
                console.log("Error", err);
                console.log(err.response);
            });

            this.getData();

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

    .listaCarrito{
        list-style: none;
        width: 90%;
    }

    .productoCarrito{
        background: #4ac8cf67;
        border-radius: 20px;
        margin-bottom: 20px;
        width: 100%;
        min-height: 100px;
        height: auto;
    }

    .productoCarrito a{
        display: flex;
        justify-items: center;
        align-items: center;
        text-decoration: none;
        color: black;
    }

    .productoCarrito h2{
        margin-top: 26px;
        padding-left: 20px;
        width: auto;
        max-width: 620px;
        overflow: hidden;
        cursor: pointer;
    }

    .productoCarrito h3{
        font-size: 25px;
        margin-left: 45%;
        display: flex;
        justify-content: left;
        align-items: center;
        position: absolute;
    }

    .controls{
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        margin-left: 68%;
        font-size: 25px;
        font-weight: bold;
    }

    .controls .cantidad{
        display: flex;
        align-items: center;
    }

    .controls input{
        width: 40px;
        height: 30px;
        margin-left: 30px;
        margin-right: 85px;
    }

    .controls img{
        width: 30px;
        cursor: pointer;
    }

    .imageCarrito{
        width: 15%;
        height: 100px;
        margin-top: -5px;
        margin-left: 55%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
    }

    .imageCarrito img{
        height: 85%;
        max-width: 170px;
    }

    .information button{
        width: 15%;
        height: 40px;

        color: white;
        background: #4ac9cf;
        border: 1px solid #71C9CE;

        border-radius: 5px;
        padding: 10px 25px;
        margin: 25px 0 70px 0;
    }

    .information button:hover{
        color: black;
        background: #a9eef1;
        border: 1px solid #4ac8cf23;
    }

</style>