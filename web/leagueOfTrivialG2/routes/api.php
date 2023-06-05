<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GamesController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ChallengesController;
use App\Http\Controllers\RankingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/store-user', [UsersController::class, 'store']);
Route::post('/dailyPlayed', [UsersController::class, 'dailyPlayed']);
Route::post('/store-data', [GamesController::class, 'store']);
Route::post('/store-score', [RankingsController::class, 'store']);
Route::post('/store-dailyScore', [RankingsController::class, 'storeDaily']);
Route::post('/checkDaily', [RankingsController::class, 'checkDaily']);
Route::post('/store-challenge', [ChallengesController::class, 'store']);
Route::post('/set-ingame', [UsersController::class, 'inGame']);
Route::post('/set-finishedGame', [UsersController::class, 'gameFinished']);
Route::post('/penalize', [UsersController::class, 'penalize']);

Route::get('/get-users', [UsersController::class, 'index']);
Route::get('/get-games', [GamesController::class, 'index']);
Route::get('/get-daily', [GamesController::class, 'getDaily']);
Route::get('/get-demo', [GamesController::class, 'getDemo']);
Route::get('/get-rankings', [RankingsController::class, 'index']);
Route::get('/get-dailyRankings', [RankingsController::class, 'dailyRanking']);
Route::post('/get-challenge', [ChallengesController::class, 'getGametoChallenge']);
Route::post('/get-userChallenges', [ChallengesController::class, 'userChallenges']);

Route::post('/get-userRanking', [UsersController::class, 'userInfo']);
Route::post('/update-profile', [UsersController::class, 'updateProfile']);
Route::get('/check-user', [UsersController::class, 'checkLogin']);

Route::post('/login', [UsersController::class, 'login']);
Route::post('/logout', [UsersController::class, 'logout']);
