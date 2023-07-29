<template>

    <div class="container" v-if="producto">
	
        <h1>{{producto.nombre}}</h1>
        <div class="image">
            <img v-bind:src="'https://locomproback.onrender.com/product/image/'+producto.productImage"
            alt="Imagen Producto" title="Product Image">
        </div>

        <div class="data">
            <h2><strong>Precio: </strong>${{producto.precio}}</h2>
            <h3><strong>Marca: </strong>{{producto.marca.nombre}}</h3>
            <h3><strong>Stock: </strong>{{producto.stock}}</h3><br>
            <p>{{producto.descripcion}}</p>
	    </div>

        <p class="buttons">
			<a class="button-add" v-on:click="addToCart()">Agregar al Carrito</a>
            <a class="button-edit" v-if="admin && email" v-on:click="editProduct()">Editar Producto</a>
			<a class="button-delete" v-if="admin && email" v-on:click="deleteProduct()">Eliminar Producto</a>
		</p>

    </div>

</template>


<script>
import jwt_decode from "jwt-decode";
import axios from "axios";

export default {
    name: "Home",

    data: function(){

        this.getInfo();

        return {
            id: null,
            email: localStorage.getItem('email') || "",
            producto: null,
            admin: false
        }
    },

    methods: {

        init: function(){
            this.id = window.location.href.split("/product/")[1];

            try{
                let token = localStorage.getItem("accessToken");
                let userId = jwt_decode(token).idUser.toString();

                if(userId == 1) this.admin = true;
            }catch(e){
                this.admin = false;
            }

            this.producto = null;
        },

        getInfo: function(){
            
            this.id = window.location.href.split("/product/")[1];

            axios.get(`https://locomproback.onrender.com/product/${this.id}`).then(result => {
                console.log(result.data.data);
                this.cargado = true;
                this.producto = result.data.data;
            }).catch(err => {
                console.log("Error", err);
            });
        },

        addToCart: async function(){

            if(!this.email){
                return this.$emit("needToLogIn");
            }

            console.log("Añadiendo");

            await this.verifyToken();
            
            let token = localStorage.getItem("accessToken");
            let userId = jwt_decode(token).idUser.toString();

            axios.post(`https://locomproback.onrender.com/user/cart/${userId}`, {producto: this.id, cantidad: 1}, {headers: {'Authorization': `Bearer ${token}`}})
            .then(result => {
                alert("Producto agregado al carrito");
            }).catch(err => {
                console.log("Error", err);
            });
        },

        deleteProduct: function(){
            console.log("Borrando");

            let confirmado = confirm(`¿Está seguro que desea eliminar el producto "${this.producto.nombre}" del inventario?`);
            if(!confirmado) return;

            axios.delete(`https://locomproback.onrender.com/product/${this.id}`)
            .then(result => {
                alert("Producto eliminado satisfactoriamente");
            }).catch(err => {
                console.log("Error", err);
            });

            window.location.href = window.location.href;
        },

        editProduct: function(){
            console.log("Editando");

            let confirmado = confirm(`¿Está seguro que desea editar el producto "${this.producto.nombre}"?\nTendrá que agregar la imágen de nuevo.`);
            if(!confirmado) return;

            this.$emit("loadForm", 'editar', this.id);
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
                    console.log("Por aca")
					this.$emit('logOut');
				});
        },

    },

    created: function(){
        this.init();
    }
}

</script>

<style>
    .container{
        padding: 50px;
        padding-top: 20px;
    }

    .container h1{
        display: block;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-size: 45px;
        font-style: italic;
    }

    .data h2, .data h3{
        font-size: 25px;
        font-weight: lighter;
    }

    .data p{
        font-size: 20px;
        width: 88%;
        text-align: justify;
    }

    .container .image{
        float: left;
        width: 48%;
    }

    .container img{
        width: 100%;
        margin-bottom: 100px;
    }

    .container .data{
        margin-left: 52%;
    }

    .container .buttons{
        margin-left: 52%;
        margin-bottom: 10%;
    }

    .button-add, .button-edit, .button-delete{
        display: block;
        font-size: 20px;
        padding: 10px;
        margin-top: 10%;
        color: white;
        background: #4ac9cf;
        border: 1px solid #71C9CE;
        cursor: pointer;
        border: none;
        cursor: pointer;
        text-decoration: none;
        width: 85%;
        margin-right: 15px;
        text-align: center;
    }

    .button-edit, .button-delete{
        margin-top: 3%;
        width: 40%;
        float: left;
        margin-right: 15px;
        text-align: center;
    }

    .button-add:hover{
        color: black;
        background: #a9eef1;
    }

    .button-edit:hover{
        background: rgb(9, 129, 93);
    }

    .button-delete:hover{
        background: rgba(255, 0, 0, 0.9);
    }
    
</style>