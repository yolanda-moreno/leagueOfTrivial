<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
    <script src="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js"></script>
    <script src="https://unpkg.com/vue-router@3/dist/vue-router.js"></script>
    <style>
        .option {
            background-color: white;
        }

        .correct:disabled {
            background-color: rgb(187 247 208) !important;
        }

        .false:disabled {
            background-color: rgb(254 202 202) !important;
        }
    </style>
</head>

<body>
    @yield('content')
</body>


</html>