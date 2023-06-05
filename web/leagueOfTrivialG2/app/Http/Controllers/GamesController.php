<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GamesController extends Controller
{
    public function store(Request $request)
    {
        // $request->validate([
        //     'quiz' => 'required',
        //     'difficulty' => 'required',
        //     'category' => 'required'
        // ]);
        $game = new Game();
        $game->type = "normal";
        $game->difficulty = $request->difficulty;
        $game->category = $request->category;
        $game->quiz = json_encode($request->quiz);
        $game->save();
        return response()->json($game->id);
    }
    public function index()
    {
        $games = Game::all();
        $games = json_encode($games);

        return response()->json($games);
    }
    public function getDaily()
    {
        $game = DB::table('games')->where('type', 'daily')->value('quiz');

        return response()->json($game);
    }
    public function getDemo()
    {
        $game = DB::table('games')->where('type', 'demo')->value('quiz');

        return response()->json($game);
    }
}
