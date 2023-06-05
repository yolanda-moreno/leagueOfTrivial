@extends('app')
@section('content')
<div id="app">
    <quiz-lobby></quiz-lobby>
</div>
<script src="{{ URL::asset('js/app.js') }}"></script>
@endsection