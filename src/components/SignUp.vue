<template>

    <div class="signUp_user">
        <div class="container_signUp_user">
            <h2>Registrarse</h2>

            <form v-on:submit.prevent="processSignUp" >
                <input type="text" v-model="user.nombres" placeholder="Nombres" required>
                <br>

                <input type="text" v-model="user.apellidos" placeholder="Apellidos" required>
                <br>

                <input type="number" v-model="user.cedula" placeholder="Cédula" required>
                <br>

                <input type="email" v-model="user.email" placeholder="Email" required>
                <br>
                
                <input type="password" v-model="user.password" placeholder="Password" required>
                <br>

                <input type="text" v-model="user.direccion" placeholder="Dirección" required>
                <br>

                <input type="number" v-model="user.edad" placeholder="Edad" min="16" max="105" required>
                <br>

                <p>Genero</p>
                <br>

                <label>
                    <input type="radio" name="genero" value="M" v-model="user.genero">Masculino
                </label>
                <br>
                
                <label>
                    <input type="radio" name="genero" value="F" v-model="user.genero">Femenino
                </label>

                <button type="submit">Registrarse</button>

            </form>
        </div>

    </div>

</template>




<script>
import axios from 'axios';

export default {
    name: "SignUp",

    data: function(){
        return {
            user: {
                nombres: "",
                apellidos: "",
                cedula: "",
                password: "",
                email: "",
                direccion: "",
                edad: "",
                genero: "",
            }
        }
    },

    methods: {
        processSignUp: function(){
            axios.post(
                "https://locomproback.onrender.com/user/signup/",
                this.user,
                {headers: {}}
            )
                .then((result) => {
                    let dataSignUp = {
                        email: this.user.email,
                        accessToken: result.data.accessToken,
                        refreshToken: result.data.refreshToken,
                    }
                    
                    this.$emit('completedSignUp', dataSignUp)
                })
                .catch((error) => {
                    console.log(error)
                    alert("ERROR: Fallo en el registro.");  
                });
        }
    }
}
</script>






<style>

    .signUp_user{
        margin: 50px 0;
        padding: 0%;
        height: 100%;
        width: 100%;
    
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container_signUp_user {
        border: 3px solid  #4ac9cf;
        border-radius: 10px;
        width: 25%;
        height: 80%;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .signUp_user h2{
        color: black;

    }

    .signUp_user form{
        width: 70%;
        text-align: center;
    }

    .signUp_user input{
        height: 40px;
        width: 100%;

        box-sizing: border-box;
        padding: 10px 20px;
        margin: 5px 0;

        color: black;
        border: 2px solid #4ac8cf60;
    }

    input:focus, textarea:focus{
        outline: 2px solid #4ac8cfad;     /* oranges! yey */
    }

    input[type='radio']:checked:after {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        top: 2.3px;
        left: 12.2px;
        position: relative;
        background-color: #4ac9cf;
        content: '';
        display: inline-block;
        visibility: visible;
    }

    .signUp_user p{
        font-size: 20px;
        margin-top: 10px;
        margin-bottom: -10px;
        width: 100%;
    }

    .signUp_user label{
        text-align: center;
    }

    .signUp_user label input{
        height: 20px;
        width: 40px;
    }

    .signUp_user button{
        width: 100%;
        height: 40px;

        color: white;
        background: #4ac9cf;
        border: 1px solid #71C9CE;

        border-radius: 5px;
        padding: 10px 25px;
        margin: 25px 0 25px 0;
    }

    .signUp_user button:hover{
        color: black;
        background: #a9eef1;
        border: 1px solid #4ac8cf23;
    }

</style>