import React, { useState, useEffect } from "react";

function EntradaSalidaManager() {
    const [historial, setHistorial] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tipo, setTipo] = useState("entrada"); // 'entrada' o 'salida'
    const [formData, setFormData] = useState({
        compania: "",
        nombreConductor: "",
        celular: "",
        placa: "",
        tipoVehiculo: "Camion",
        observaciones: "",
        fotos: [],
    });

    // Cargar historial desde el backend
    useEffect(() => {
        fetchHistorial();
    }, []);

    const fetchHistorial = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/ingresos-salidas");
            const data = await response.json();
            setHistorial(data);
        } catch (error) {
            console.error("Error al cargar el historial:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            fotos: [...prev.fotos, ...files],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("tipo", tipo);
        formDataToSend.append("compania", formData.compania);
        formDataToSend.append("nombreConductor", formData.nombreConductor);
        formDataToSend.append("celular", formData.celular);
        formDataToSend.append("placa", formData.placa);
        formDataToSend.append("tipoVehiculo", formData.tipoVehiculo);
        formDataToSend.append("observaciones", formData.observaciones);
        formData.fotos.forEach((file) => formDataToSend.append("fotos", file));

        try {
            const response = await fetch("http://localhost:5000/api/entrada-salida", {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) throw new Error("Error al crear el registro");
            alert("Registro creado correctamente");
            setIsModalOpen(false);
            fetchHistorial(); // Actualizar el historial
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Gestión de Entradas y Salidas</h2>

            {/* Botones para abrir modales */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => {
                        setTipo("entrada");
                        setIsModalOpen(true);
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Registrar Entrada
                </button>
                <button
                    onClick={() => {
                        setTipo("salida");
                        setIsModalOpen(true);
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Registrar Salida
                </button>
            </div>

            {/* Historial */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Historial de Registros</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Compañía
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Conductor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Placa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {historial.map((registro) => (
                            <tr key={registro._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{registro.tipo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{registro.compania}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{registro.nombreConductor}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{registro.placa}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(registro.fecha).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black opacity-50"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto z-50">
                        <h3 className="text-lg font-semibold mb-4">
                            Registrar {tipo === "entrada" ? "Entrada" : "Salida"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Grupo 1: Compañía y Nombre del Conductor */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Compañía</label>
                                    <input
                                        type="text"
                                        name="compania"
                                        value={formData.compania}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Nombre del Conductor</label>
                                    <input
                                        type="text"
                                        name="nombreConductor"
                                        value={formData.nombreConductor}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Grupo 2: Celular y Placa */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Celular</label>
                                    <input
                                        type="text"
                                        name="celular"
                                        value={formData.celular}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Placa</label>
                                    <input
                                        type="text"
                                        name="placa"
                                        value={formData.placa}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Grupo 3: Tipo de Vehículo y Observaciones */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Vehículo</label>
                                    <select
                                        name="tipoVehiculo"
                                        value={formData.tipoVehiculo}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="Camion">Camión</option>
                                        <option value="Van">Van</option>
                                        <option value="Botellero">Botellero</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        name="observaciones"
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Fotos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fotos</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EntradaSalidaManager;