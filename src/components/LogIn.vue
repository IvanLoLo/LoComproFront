<template>

    <div class="logIn_user">
        <div class="container_logIn_user">
            <h2>Iniciar sesión</h2>

            <form v-on:submit.prevent="processLogInUser" >
                <input type="text" v-model="user.email" placeholder="Email">
                <br>
                <input type="password" v-model="user.password" placeholder="Password">
                <br>
                <button type="submit">Iniciar Sesion</button>
            </form>
        </div>

    </div>

</template>




<script>
import axios from 'axios';

export default {
    name: "LogIn",

    data: function(){
        return {
            user: {
                email:"",
                password:""
            }
        }
    },

    methods: {
        processLogInUser: function(){
            axios.post(
                //"http://localhost:3700/user/login/",
                "https://c3g10-backend.herokuapp.com/user/login/", 
                this.user,
                {headers: {}}
                )
                .then((result) => {
                    let dataLogIn = {
                        email: this.user.email,
                        accessToken: result.data.accessToken,
                        refreshToken: result.data.refreshToken,
                    }
                    
                    this.$emit('completedLogIn', dataLogIn)
                })
                .catch((error) => {

                    console.log(error);
                    
                    if (error.response.status > 300)
                        alert("Credenciales Incorrectas.");

                    document.getElementsByTagName("input")[0].value=""
                    document.getElementsByTagName("input")[1].value=""
                    
                });
        }
    }
}
</script>






<style>

    .logIn_user{
        margin: 0;
        padding: 0%;
        height: 70vh;
        width: 100%;
    
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container_logIn_user {
        border: 3px solid  #4ac9cf;
        border-radius: 10px;
        width: 25%;
        height: 60%;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .logIn_user h2{
        color: black;

    }

    .logIn_user form{
        width: 70%;
        
    }

    .logIn_user input{
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

    .logIn_user button{
        width: 100%;
        height: 40px;

        color: white;
        background: #4ac9cf;
        border: 1px solid #71C9CE;

        border-radius: 5px;
        padding: 10px 25px;
        margin: 5px 0;
    }

    .logIn_user button:hover{
        color: black;
        background: #a9eef1;
        border: 1px solid #4ac8cf23;
    }

</style>