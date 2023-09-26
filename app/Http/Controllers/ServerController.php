<?php

namespace App\Http\Controllers;

use App\Events\Notifications;
use Illuminate\Http\Request;

class ServerController extends Controller
{
    public function index()
    {
        event(new Notifications('test'));
    }

    public function fetch()
    {
        return view('welcome');
    }
}
