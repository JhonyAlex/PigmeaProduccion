// ...existing code...

// Rutas para manejar operarios de máquinas
Route::get('/maquinas/{maquina}/operarios', 'App\Http\Controllers\MaquinaController@getOperarios');
Route::get('/maquinas/operarios-disponibles/{maquina}', 'App\Http\Controllers\MaquinaController@getOperariosDisponibles');
Route::put('/maquinas/{maquina}', 'App\Http\Controllers\MaquinaController@update');

// ...existing code...
