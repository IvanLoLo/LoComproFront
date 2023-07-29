<template>

    <div class="greetings">
        <h1>Productos disponibles <span v-if="is_auth"> para ti, {{email.split("@")[0]}}</span></h1>
    </div>

    <ul id="v-for-object" class="listadoProductos">
        <li class="producto" v-for:="item in lista">
            <div class="info" v-on:click="loadProduct(item.idProducto)">
                <h2>{{ item.nombre }}</h2>
                <div class="imageList">
                    <img v-bind:src="'https://locomproback.onrender.com/product/image/'+item.productImage">
                </div>
                <h3>${{ item.precio }}</h3>
            </div>
        </li>
    </ul>

</template>


<script>
import axios from 'axios';

export default {
    name: "Products",

    data: function(){

        this.listing();

        return {
            cargado: false,
            lista: null,
            is_auth: localStorage.getItem('isAuth') || false,
            email: localStorage.getItem('email') || ""
        }
    },

    methods: {

        inicio: function(){
            this.cargado = false;
            this.lista = null;
        },
        
        listing: function(){
            axios.get("https://locomproback.onrender.com").then(result => {
                this.cargado = true;
                this.lista = result.data.data;
            }).catch(err => {
                console.log("Error", err);
            });
        },

        getImageUrl: function(item){
            console.log("Buscando imagen");
            return "https://locomproback.onrender.com/product/image/"+item;
        },

        loadProduct: function(product){
            console.log("Ir a producto", product);
            this.$emit('productSelected', product);
        }
    },

    created: function(){
        this.inicio();
    }

}

</script>

<style>

    .greetings{
        margin: 0;
        padding: 0%;
        height: 20%;
        width: 100%;
    
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .greetings h1{
        font-size: 40px;
        color: black;
    }

    .listadoProductos{
        margin-top: 0;
    }

    .listadoProductos li{
        background: #c7fcf469;
        -webkit-box-shadow: 0px 0px 9px 1px rgba(41, 41, 41, 0.15);
        -moz-box-shadow: 0px 0px 9px 1px rgba(41,41,41,.15);
        box-shadow: 0px 0px 9px 1px rgba(41,41,41,.15);
    }

    .listadoProductos li:hover{
        background: #9dfaea98;
        transition: 300ms;
    }

    .producto img{
        /*
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        */
        width: 100%;
    }

    .producto .imageList{
        height: 190px;
        overflow: hidden;
    }

    .producto{
        list-style: none;
        display: block;
        float: left;
        width: 20%;
        text-align: center;
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 40px;
    }

    .producto .info{
        text-decoration: none;
        color: black;
        cursor: pointer;
    }

</style>