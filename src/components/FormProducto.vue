<template>

    <div class="formProduct">
        <div class="container_formProduct">
            <h2>{{accion}} Producto</h2>
            <span v-if="accion == 'Editar'">Si no selecciona un archivo, se establecerá la imagen por defecto</span>
            <form v-on:submit.prevent="processAction">
                <input type="text" v-model="product.nombre" placeholder="Nombre" required>
                <br>

                <textarea name="descripcion" id="" rows="4" v-model="product.descripcion" placeholder="Descripción"></textarea>
                <br>

                <input type="number" v-model="product.precio" min="50" placeholder="Precio" required>
                <br>

                <input type="number" v-model="product.stock" min="0" placeholder="Stock" required>
                <br>
                <!--
                <input type="number" v-model="product.marcaId" placeholder="marcaId">
                <br>
                -->
                <select id="marcaSelect" @change="cambiarMarca($event)" required>
                    <option value="-1" disabled hidden selected>Marca</option>
                    <option v-for:="marca in marcas" v-bind:value="marca.idMarca">{{marca.nombre}}</option>
                </select>
                
                <input id="archivo" type="file" @change="fileChange">
                <br>

                <button type="submit">{{accion}}</button>
            </form>
        </div>

    </div>

</template>


<script>
import axios from 'axios';

export default {
    name: "FormProducto",

    data: function(){

        let url = window.location.href.split("product/")[1];
        
        if(url.length>5) url = url.split("/")[0];

        return {
            product: {
                nombre: "",
                precio: "",
                descripcion: "",
                stock: "",
                marcaId: "",
                productImage: "",
            },
            accion: url[0].toUpperCase() + url.slice(1).toLowerCase(),
            image: null,
            marcas: null,
        }
    },

    methods: {

        cargarInfo: function(id){
            console.log("Cargando los datos del producto", id);
            axios.get(`https://c3g10-backend.herokuapp.com/product/${id}`).then(result => {
                let data = result.data.data;
                this.product = {
                    nombre: data.nombre,
                    precio: data.precio,
                    descripcion: data.descripcion,
                    stock: data.stock,
                    marcaId: data.marca.idMarca,
                    productImage: data.productImage,
                }
                console.log(this.product);
                document.getElementById("marcaSelect").value = this.product.marcaId;
            }).catch(err => {
                console.log("Error", err);
            });

        },
        
        processAction: function(){

            console.log("A procesar");
            console.log(this.product.marcaId);

            if(this.product.marcaId == -1 || this.product.marcaId == ""){
                alert("Por favor seleccione una marca");
                return;
            }

            if(this.accion=="Crear"){
                this.createProduct();
            }else this.updateProduct();

        },

        createProduct: function(){

            let formulario = this.createFormData();

            axios.post(
                "https://c3g10-backend.herokuapp.com/product",
                formulario,
                {headers: {'Content-Type': 'multipart/form-data'}}
            )   
                .then((result) => {
                    alert("Producto creado");
                    this.$emit("productSelected", result.data.producto.idProducto);
                })
                .catch((error) => {
                    console.log(error)
                    alert("ERROR: Fallo en el registro.");
                });
        },

        updateProduct: function() {
            let formulario = this.createFormData();
            console.log(formulario);
            axios.put(
                `https://c3g10-backend.herokuapp.com/product/${this.id}`,
                formulario,
                {headers: {'Content-Type': 'multipart/form-data'}}
            )   
                .then((result) => {
                    alert("Producto actualizado");
                    this.$emit("productSelected", this.id);
                })
                .catch((error) => {
                    console.log(error)
                    alert("ERROR: Fallo en el registro.");
                });
        },

        createFormData: function(){
            let formData = new FormData();
            formData.append("nombre", this.product.nombre);
            formData.append("precio", this.product.precio);
            formData.append("descripcion", this.product.descripcion);
            formData.append("stock", this.product.stock);
            formData.append("marcaId", this.product.marcaId);
            console.log("Formulario", this.product);
            formData.append("productImage", this.image);

            return formData;
        },

        fileChange(fileInput){
            this.fileChanged = true;
            this.image = fileInput.target.files[0]; 
        },

        cambiarMarca: function(evento){
            this.product.marcaId = evento.target.value;
        }

    },

    created: function(){
        this.url = window.location.href.split("product/")[1];
        if(this.url.length>5){
            this.url = this.url.split("/");
            this.id = this.url[1];
            this.cargarInfo(this.id);
            this.url = this.url[0];
        }
        

        //Traer marcas
        axios.get(`https://c3g10-backend.herokuapp.com/marcas`).then(result => {
            let data = result.data.data;
            this.marcas = result.data.data;
        }).catch(err => {
            console.log("Error", err);
        });
    }

}
</script>


<style>

    .formProduct{
        margin: 50px 0;
        padding: 0%;
        height: 100%;
        width: 100%;
    
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container_formProduct {
        border: 3px solid  #4ac9cf;
        border-radius: 10px;
        width: 25%;
        height: 80%;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .container_formProduct span{
            margin-bottom: 20px;
            width: 70%;
            text-align: center;
    }

    .formProduct h2{
        color: black;

    }

    .formProduct form{
        width: 70%;
        text-align: center;
    }

    form textarea{
        width: 85%;
        resize: vertical;
        border: 2px solid #4ac8cf60;
        color: black;
        padding-top: 5%;
        padding-left: 7%;
        padding-right: 7%;
    }

    form select {
        width: 100%;
        color: black;
        border: 2px solid #4ac8cf60;
        padding: 10px;
        padding-left: 18px;
        margin: 5px 0;
    }

    .formProduct input{
        height: 40px;
        width: 100%;

        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;

        color: black;
        border: 2px solid #4ac8cf60;
    }

    input:focus, textarea:focus, select:focus{
        outline: 2px solid #4ac8cfad;     /* oranges! yey */
    }

    .formProduct p{
        font-size: 20px;
        margin-top: 10px;
        margin-bottom: -10px;
        width: 100%;
    }

    .formProduct label{
        text-align: center;
    }

    .formProduct label input{
        height: 20px;
        width: 40px;
    }

    .formProduct button{
        width: 100%;
        height: 40px;

        color: white;
        background: #4ac9cf;
        border: 1px solid #71C9CE;

        border-radius: 5px;
        padding: 10px 25px;
        margin: 25px 0 25px 0;
    }

    .formProduct button:hover{
        color: black;
        background: #a9eef1;
        border: 1px solid #4ac8cf23;
    }

</style>