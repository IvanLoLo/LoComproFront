<template>

    <div class="greetingsHome">
        <h1>¡Bienvenido  <span> {{email}} </span>!</h1>
    </div>

</template>


<script>

export default {
    name: "Home",

    data: function(){
        return {
            email: localStorage.getItem('email') || "none"
        }
    }
}

</script>


<style>
    .greetings{
        margin: 0;
        padding: 0%;
        height: 100%;
        width: 100%;
    
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .greetings h1{
        font-size: 50px;
        color: #283747;
    }

    .greetingsHome span{
        color: crimson;
        font-weight: bold;
    }
</style>