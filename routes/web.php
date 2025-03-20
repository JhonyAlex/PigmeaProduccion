// ...existing code...

// Rutas para gestión de máquinas
Route::get('/maquinas', 'App\Http\Controllers\MaquinaController@index');
Route::post('/maquinas', 'App\Http\Controllers\MaquinaController@store');
Route::delete('/maquinas/{maquina}', 'App\Http\Controllers\MaquinaController@destroy');

// Rutas para manejar operarios de máquinas
Route::get('/maquinas/{maquina}/operarios', 'App\Http\Controllers\MaquinaController@getOperarios');
Route::get('/maquinas/operarios-disponibles/{maquina}', 'App\Http\Controllers\MaquinaController@getOperariosDisponibles');
Route::put('/maquinas/{maquina}', 'App\Http\Controllers\MaquinaController@update');

// ...existing code...
