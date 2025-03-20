// ...existing code...

// Rutas para manejar operarios de máquinas
Route::get('/maquinas/{maquina}/operarios', 'MaquinaController@getOperarios');
Route::get('/maquinas/operarios-disponibles/{maquina}', 'MaquinaController@getOperariosDisponibles');

// ...existing code...
