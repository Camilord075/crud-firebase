import { useState, useEffect } from 'react'
import './App.css'
import { firebase } from './database/firebase.js'

function App() {
  const [lista, setLista] = useState([])
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [id, setId] = useState('')
  const [error, setError] = useState(null)
  const [modoEdicion, setModoEdicion] = useState(false)

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore()
        const data = await db.collection('productos').get()
        const arrayData = data.docs.map(doc => ({
          id: doc.id, ...doc.data()
        }))

        setLista(arrayData)
      } catch (error) {
        console.error(error.message)
      }
    }

    obtenerDatos()
  }, [])

  const registrarProducto = async (e) => {
    e.preventDefault()

    if (!nombre.trim()) return alert("Falta el nombre")
    if (!cantidad || cantidad <= 0) return alert("El valor cantidad debe ser mayor a 0")

    try {
      const db = firebase.firestore()
      const nuevoProducto = {
        nombre,
        cantidad
      }

      const dato = await db.collection('productos').add(nuevoProducto)

      setLista([
        ...lista, 
        {...nuevoProducto, id: dato.id}
      ])
    } catch (error) {
      console.error(error.message)
    }

    setNombre('')
    setCantidad(0)
  }

  const eliminarDato = async (id) => {
    try {
      const db = firebase.firestore()
      await db.collection('productos').doc(id).delete()

      const listaFiltrada = lista.filter((elemento) => elemento.id !== id)

      setLista(listaFiltrada)
    } catch (error) {
      console.error(error.message)
    }
  }

  const editar = async (product) => {
    setModoEdicion(true)
    setNombre(product.nombre)
    setCantidad(product.cantidad)
    setId(product.id)
  }

  const editarProducto = async (e) => {
    e.preventDefault()

    if (!nombre.trim()) return alert("Falta el nombre")
    if (!cantidad || cantidad <= 0) return alert("El valor cantidad debe ser mayor a 0")

    try {
      const db = firebase.firestore()
      await db.collection('productos').doc(id).update({
        nombre,
        cantidad
      })
        
      const listaEditada = lista.map((elemento) => elemento.id === id ? {id: id, nombre: nombre, cantidad: cantidad} : elemento)
  
      setLista(listaEditada)
      setModoEdicion(false)
      setId('')
      setNombre('')
      setCantidad(0)
      setError(null)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h1 className="text-center">Lista Productos</h1>
            <div className="table-responsive">
              <table className="table table-primary">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((product) => (
                    <tr key={product.id}>
                      <td>{product.nombre}</td>
                      <td>{product.cantidad}</td>
                      <td>
                        <button type="button" className='btn btn-warning me-2' onClick={() => editar(product)}>Editar</button>
                        <button type="button" className='btn btn-danger' onClick={() => eliminarDato(product.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-6">
            <h1 className="text-center">{modoEdicion ? 'Editar Producto' : 'Registrar Producto'}</h1>
            <form onSubmit={ modoEdicion ? editarProducto : registrarProducto }>
              <input type="text" name="nombre-producto" id="nombre-producto" className='form-control mb-3' placeholder='Ingrese el nombre del Producto' required
              onChange={(e) => { setNombre(e.target.value) }} value={ nombre }/>
              <input type="number" name="cantidad-producto" id="cantidad-producto" className='form-control mb-3' placeholder='Ingrese la cantidad del Producto' required
              onChange={(e) => { setCantidad(e.target.value) }} value={ cantidad }/>
              <button type="submit" className={modoEdicion ? 'btn btn-success' : 'btn btn-primary'}>{modoEdicion ? 'Editar Producto' : 'Registrar Producto'}</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
